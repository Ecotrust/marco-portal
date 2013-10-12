
function bookmarkModel(options) {
    var self = this;

    self.uid = options.uid;
    self.name = options.name;
    self.state = options.state || null;
    
    self.shared = ko.observable();
    self.sharedByName = options.sharedByName || null;
    self.sharedByUsername = options.sharedByUsername;
    if (self.sharedByName && $.trim(self.sharedByName) !== '') {
        self.sharedByWho = self.sharedByName + ' (' + self.sharedByUsername + ')';
    } else {
        self.sharedByWho = self.sharedByUsername;
    }
    self.sharedBy = ko.observable();
    if (options.shared) {
        self.shared(true);
        self.sharedBy('Shared by ' + self.sharedByWho);
    } else {
        self.shared(false);
        self.sharedBy(false);
    }
    
    self.selectedGroups = ko.observableArray();
    self.sharedGroupsList = [];
    if (options.sharingGroups && options.sharingGroups.length) {
        self.selectedGroups(options.sharingGroups);
    } 
    self.temporarilySelectedGroups = ko.observableArray();
    
    // load state from bookmark
    self.loadBookmark = function() {
        app.saveStateMode = false;
        app.loadState(self.getBookmarkState());

        app.viewModel.bookmarks.activeBookmark(self.name);

        // show the alert for resting state
        app.viewModel.error("restoreState");
        $('#bookmark-popover').hide();
    };
    
    self.showSharingModal = function() {
        app.viewModel.bookmarks.sharingBookmark(self);
        self.temporarilySelectedGroups.removeAll();
        self.temporarilySelectedGroups(self.selectedGroups());
        $('#bookmark-share-modal').modal('show');
    };
    
    // get the url from a bookmark
    self.getBookmarkUrl = function() {
        var host = window.location.href.split('#')[0];
        host = 'http://portal.midatlanticocean.org/visualize/';
        return host + "#" + self.getBookmarkHash();
        //return host + "#" + self.state;
    };
    
    self.getBookmarkState = function() {
        return self.state;
    };
    
    self.getBookmarkHash = function() {
        return $.param(self.getBookmarkState());
    };
    
    return self;
} // end of bookmarkModel

function bookmarksModel(options) {
    var self = this;
    
    // list of bookmarks
    self.bookmarksList = ko.observableArray();
    
    self.activeBookmark = ko.observable();
    
    // current bookmark for sharing modal or map links modal
    self.sharingBookmark = ko.observable();
    
    // groups a bookmark may be shared with
    self.sharingGroups = ko.observableArray();
    
    // name of newly created bookmark
    self.newBookmarkName = ko.observable();
        
    self.toggleGroup = function(obj) {
        var groupName = obj.group_name,
            indexOf = self.sharingBookmark().temporarilySelectedGroups.indexOf(groupName);
    
        if ( indexOf === -1 ) {  //add group to list
            self.sharingBookmark().temporarilySelectedGroups.push(groupName);
        } else { //remove group from list
            self.sharingBookmark().temporarilySelectedGroups.splice(indexOf, 1);
        }
        /*var groupName = obj.group_name,
            indexOf = self.sharingBookmark().selectedGroups.indexOf(groupName);
    
        if ( indexOf === -1 ) {  //add group to list
            self.sharingBookmark().selectedGroups.push(groupName);
        } else { //remove group from list
            self.sharingBookmark().selectedGroups.splice(indexOf, 1);
        }*/
    };
    
    self.groupIsSelected = function(groupName) {
        if (self.sharingBookmark()) {
            var indexOf = self.sharingBookmark().temporarilySelectedGroups.indexOf(groupName);
            return indexOf !== -1;
        }
        return false;
    };
    
    self.groupMembers = function(groupName) {
        var memberList = "";
        for (var i=0; i<self.sharingGroups().length; i++) {
            var group = self.sharingGroups()[i];
            if (group.group_name === groupName) {
                for (var m=0; m<group.members.length; m++) {
                    var member = group.members[m];
                    memberList += member + '<br>';
                }
            }
        }
        return memberList;
    };
          
    self.getCurrentBookmarkURL = function() {
        if ( self.sharingBookmark() ) {
            return self.sharingBookmark().getBookmarkUrl();
        } else {
            return '';
        }
    };
    
    self.shrinkBookmarkURL = ko.observable();
    self.shrinkBookmarkURL.subscribe( function() {
        if (self.shrinkBookmarkURL()) {
            self.useShortBookmarkURL();
        } else {
            self.useLongBookmarkURL();
        }
    });
    
    self.resetBookmarkMapLinks = function(bookmark) {
        self.sharingBookmark(bookmark);
        self.shrinkBookmarkURL(false);
        $('#short-url').text = self.getCurrentBookmarkURL();
        self.setBookmarkIFrameHTML();
    };
    
    self.useLongBookmarkURL = function() {
        $('#bookmark-short-url')[0].value = self.sharingBookmark().getBookmarkUrl();
    };
        
    self.useShortBookmarkURL = function() {
        var bitly_login = "ecofletch",
            bitly_api_key = 'R_d02e03290041107b75e3720d7e3c4b95',
            long_url = self.sharingBookmark().getBookmarkUrl();
            
        $.getJSON( 
            "http://api.bitly.com/v3/shorten?callback=?", 
            { 
                "format": "json",
                "apiKey": bitly_api_key,
                "login": bitly_login,
                "longUrl": long_url
            },
            function(response)
            {
                $('#bookmark-short-url')[0].value = response.data.url;
            }
        );
    };
    
    self.setBookmarkIFrameHTML = function() {
        var bookmarkState = self.sharingBookmark().getBookmarkHash();
        $('#bookmark-iframe-html')[0].value = app.viewModel.mapLinks.getIFrameHTML(bookmarkState);
        
        /*var urlOrigin = window.location.origin,
            urlHash = $.param(self.sharingBookmark().state);
        
        if ( !urlOrigin ) {
            urlOrigin = 'http://' + window.location.host;
        }
        var embedURL = urlOrigin + '/embed/map/#' + urlHash
        $('#bookmark-iframe-html')[0].value = '<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" ' +
                                     'src="' + embedURL + '">' + '</iframe>' + '<br />';
        */
    };
    
    self.openBookmarkIFrameExample = function() {
        app.viewModel.mapLinks.openIFrameExample('bookmark');
        
        /*var windowName = "newMapWindow",
            windowSize = "width=650, height=550",
            mapWindow = window.open('', windowName, windowSize);
        var urlOrigin = window.location.origin;
        if ( !urlOrigin ) {
            urlOrigin = 'http://' + window.location.host;
        }
        var header = '<header role="banner"><div class="navbar navbar-fixed-top"><div class="navbar-inner"><div class="container-fluid"><div class="row-fluid"><div class="span12"><a href="/visualize"><img src="'+urlOrigin+'/media/marco/img/marco-logo_planner.jpg"/></a><h3 class="pull-right" data-bind="visible: mapTitle, text: mapTitle"></h3></div></div></div></div></div></header>';
        mapWindow.document.write('<html><body>' + header + $('#bookmark-iframe-html')[0].value + '</body></html>');
        mapWindow.document.close();
        */
    };
    
    self.removeBookmark = function(bookmark) {
        self.bookmarksList.remove(bookmark);
        
        //if the user is logged in, ajax call to add bookmark to server 
        if (app.is_authenticated) { 
            $.ajax({ 
                url: '/visualize/remove_bookmark', 
                data: { name: bookmark.name, hash: bookmark.getBookmarkHash(), uid: bookmark.uid }, 
                type: 'POST',
                dataType: 'json',
                success: function() {
                    self.updateBookmarkScrollBar();
                },
                error: function(result) { 
                    //debugger;
                } 
            });
        } 
        
        // store the bookmarks locally
        self.storeBookmarks();        
        
    };

    // handle the bookmark submit
    self.saveBookmark = function() {
        // add to the list of bookmarks
        var bookmarkState = app.getState(),
            bookmark = new bookmarkModel( { 
                state: bookmarkState,
                name: self.newBookmarkName()
            });
            
        //if the user is logged in, ajax call to add bookmark to server 
        if (app.is_authenticated) { 
            $.ajax({ 
                url: '/visualize/add_bookmark', 
                data: { name: self.newBookmarkName(), hash: window.location.hash.slice(1) }, 
                type: 'POST',
                dataType: 'json',
                success: function(bookmark) {
                    var newBookmark = new bookmarkModel( {
                        state: $.deparam(bookmark[0].hash),
                        name: bookmark[0].name,
                        uid: bookmark[0].uid,
                        sharingGroups: bookmark[0].sharing_groups
                    });
                    self.bookmarksList.unshift(newBookmark);
                    var bms = self.bookmarksList();
                    self.bookmarksList(_.sortBy(bms, 'name'));
                    self.updateBookmarkScrollBar();
                },
                error: function(result) { 
                    //debugger;
                } 
            });
        } else {
            self.bookmarksList.unshift(bookmark);
            var bms = self.bookmarksList; 
            self.bookmarksList(_.sortBy(bms, 'name'));
            // store the bookmarks locally
            self.storeBookmarks();
        }
        //$('#bookmark-popover').hide();
        self.newBookmarkName('');
        
    };
    
    // get bookmark sharing groups for this user
    self.getSharingGroups = function() {
        $.ajax({
            url: '/visualize/get_sharing_groups',
            type: 'GET',
            dataType: 'json',
            success: function (groups) {
                self.sharingGroups(groups);
            },
            error: function (result) {
                //console.log('error in getSharingGroups');
            }
        });
    };
    
    // store the bookmarks to local storage
    self.storeBookmarks = function() {
        var ownedBookmarks = [];
        for (var i=0; i<self.bookmarksList().length; i++) {
            var bookmark = self.bookmarksList()[i];
            if ( ! bookmark.shared() ) {
                ownedBookmarks.push(bookmark);
            }
        }
        amplify.store("marco-bookmarks", ownedBookmarks);
    };
    
    self.updateBookmarkScrollBar = function() {
        var bookmarkScrollpane = $('#bookmarks-table').data('jsp');
        if (bookmarkScrollpane === undefined) {
            $('#bookmarks-table').jScrollPane();
        } else {
            bookmarkScrollpane.reinitialise();
        }
    };

    // method for loading existing bookmarks
    self.getBookmarks = function() {
        //get bookmarks from local storage
        var existingBookmarks = amplify.store("marco-bookmarks"),
            local_bookmarks = [];
        if (existingBookmarks) {
            for (var i=0; i < existingBookmarks.length; i++) {
                local_bookmarks.push( {
                    'name': existingBookmarks[i].name,
                    'hash': existingBookmarks[i].hash,
                    'sharing_groups': existingBookmarks[i].sharingGroups
                });
            }
        }
        
        // load bookmarks from server while syncing with client 
        //if the user is logged in, ajax call to sync bookmarks with server 
        if (app.is_authenticated) { 
            $.ajax({ 
                url: '/visualize/get_bookmarks', 
                data: { bookmarks: local_bookmarks }, 
                type: 'POST',
                dataType: 'json',
                success: function(result) {
                    var bookmarks = result || [],
                        blist = [];
                    for (var i=0; i < bookmarks.length; i++) {
                        var bookmark = new bookmarkModel( {
                            state: $.deparam(bookmarks[i].hash),
                            name: bookmarks[i].name,
                            uid: bookmarks[i].uid,
                            shared: bookmarks[i].shared,
                            sharedByUsername: bookmarks[i].shared_by_username,
                            sharedByName: bookmarks[i].shared_by_name,
                            sharingGroups: bookmarks[i].sharing_groups
                        });   
                        blist.push(bookmark);
                    }
                    if (blist.length > 0) {
                        //self.bookmarksList(blist);
                        self.bookmarksList(_.sortBy(blist, 'name'));
                        //self.storeBookmarks();
                    }
                },
                error: function(result) { 
                    if (existingBookmarks) {
                        for (var i=0; i < existingBookmarks.length; i++) {
                            self.bookmarksList.push( new bookmarkModel( {
                                name: existingBookmarks[i].name,
                                state: existingBookmarks[i].state,
                                sharing_groups: existingBookmarks[i].sharingGroups
                            }));
                        }
                        //self.bookmarksList = ko.observableArray(existingBookmarks);
                    } 
                } 
            });
        } else if (existingBookmarks) {
            for (var i=0; i < existingBookmarks.length; i++) {
                self.bookmarksList.push( new bookmarkModel( {
                    name: existingBookmarks[i].name,
                    state: existingBookmarks[i].state,
                    sharing_groups: existingBookmarks[i].sharingGroups
                }));
            }
            //self.bookmarksList = ko.observableArray(existingBookmarks);
        } 
        self.getSharingGroups();
    };
    
    //sharing bookmark
    self.submitShare = function() {
        self.sharingBookmark().selectedGroups(self.sharingBookmark().temporarilySelectedGroups());
        var data = { 'bookmark': self.sharingBookmark().uid, 'groups': self.sharingBookmark().selectedGroups() };
        $.ajax( {
            url: '/visualize/share_bookmark',
            data: data,
            type: 'POST',
            dataType: 'json',
            success: function(result) {
                //debugger;
            },
            error: function(result) {
                //debugger;
            }
        });
    };

    self.cancel = function() {
        $('#bookmark-popover').hide();
    };

    self.restoreState = function() {
        // hide the error
        app.viewModel.error(null);
        // restore the state
        app.loadState(app.restoreState);
        app.saveStateMode = true;
    };

    // load the bookmarks
    self.getBookmarks();

    
    return self;
} // end of bookmarksModel

app.viewModel.bookmarks = new bookmarksModel();
