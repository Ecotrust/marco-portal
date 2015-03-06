from django.contrib import admin
from import_export import fields
from import_export import resources
from import_export.admin import ExportMixin
from django.contrib.auth.models import User
from madrona.common.admin import UserAdmin


class UserResource(resources.ModelResource):
    name = fields.Field()

    def dehydrate_name(self, user):
        return '%s %s' %(user.first_name, user.last_name)

    class Meta:
        model = User
        fields = ('name', 'email')
        # exclude = ('is_staff', 'is_active', )

class UserAdmin(ExportMixin, UserAdmin):
    resource_class = UserResource

admin.site.unregister(User)
admin.site.register(User, UserAdmin)