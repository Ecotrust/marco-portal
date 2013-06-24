# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Layer.attributes_from_web_services'
        db.delete_column('data_manager_layer', 'attributes_from_web_services')

        # Deleting field 'Layer.attribute_title'
        db.delete_column('data_manager_layer', 'attribute_title')

        # Deleting field 'Layer.data_status'
        db.delete_column('data_manager_layer', 'data_status')

        # Deleting field 'Layer.fact_sheet'
        db.delete_column('data_manager_layer', 'fact_sheet')


    def backwards(self, orm):
        # Adding field 'Layer.attributes_from_web_services'
        db.add_column('data_manager_layer', 'attributes_from_web_services',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Layer.attribute_title'
        db.add_column('data_manager_layer', 'attribute_title',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Layer.data_status'
        db.add_column('data_manager_layer', 'data_status',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Layer.fact_sheet'
        db.add_column('data_manager_layer', 'fact_sheet',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)


    models = {
        'data_manager.attributeinfo': {
            'Meta': {'object_name': 'AttributeInfo'},
            'display_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'field_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'precision': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'data_manager.dataneed': {
            'Meta': {'object_name': 'DataNeed'},
            'archived': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'contact': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'contact_email': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'expected_date': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'source': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'themes': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['data_manager.Theme']", 'null': 'True', 'blank': 'True'})
        },
        'data_manager.layer': {
            'Meta': {'object_name': 'Layer'},
            'arcgis_layers': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'attribute_event': ('django.db.models.fields.CharField', [], {'default': "'click'", 'max_length': '35'}),
            'attribute_fields': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['data_manager.AttributeInfo']", 'null': 'True', 'blank': 'True'}),
            'bookmark': ('django.db.models.fields.CharField', [], {'max_length': '755', 'null': 'True', 'blank': 'True'}),
            'compress_display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'data_download': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'data_notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'data_overview': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'data_source': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_sublayer': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'kml': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'layer_type': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'learn_more': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'legend': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'legend_subtitle': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'legend_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'lookup_field': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'lookup_table': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['data_manager.LookupInfo']", 'null': 'True', 'blank': 'True'}),
            'map_tiles': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'metadata': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'opacity': ('django.db.models.fields.FloatField', [], {'default': '0.5', 'null': 'True', 'blank': 'True'}),
            'shareable_url': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'slug_name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'source': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'sublayers': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'sublayers_rel_+'", 'null': 'True', 'to': "orm['data_manager.Layer']"}),
            'themes': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['data_manager.Theme']", 'null': 'True', 'blank': 'True'}),
            'thumbnail': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'utfurl': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'vector_color': ('django.db.models.fields.CharField', [], {'max_length': '7', 'null': 'True', 'blank': 'True'}),
            'vector_fill': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'vector_graphic': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        'data_manager.lookupinfo': {
            'Meta': {'object_name': 'LookupInfo'},
            'color': ('django.db.models.fields.CharField', [], {'max_length': '7', 'null': 'True', 'blank': 'True'}),
            'dashstyle': ('django.db.models.fields.CharField', [], {'default': "'solid'", 'max_length': '11'}),
            'fill': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'graphic': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        'data_manager.theme': {
            'Meta': {'object_name': 'Theme'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'display_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'factsheet_link': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'factsheet_thumb': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'feature_excerpt': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'feature_image': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'feature_link': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'header_attrib': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'header_image': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'overview': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'thumbnail': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['data_manager']