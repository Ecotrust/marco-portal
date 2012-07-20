# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Theme'
        db.create_table('data_manager_theme', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('data_manager', ['Theme'])

        # Adding model 'Layer'
        db.create_table('data_manager_layer', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('layer_type', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('url', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('is_sublayer', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('legend', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('utfurl', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('bookmark', self.gf('django.db.models.fields.CharField')(max_length=755, null=True, blank=True)),
            ('map_tiles', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('kml', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('data_download', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('metadata', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('fact_sheet', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('source', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
        ))
        db.send_create_signal('data_manager', ['Layer'])

        # Adding M2M table for field sublayers on 'Layer'
        db.create_table('data_manager_layer_sublayers', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('from_layer', models.ForeignKey(orm['data_manager.layer'], null=False)),
            ('to_layer', models.ForeignKey(orm['data_manager.layer'], null=False))
        ))
        db.create_unique('data_manager_layer_sublayers', ['from_layer_id', 'to_layer_id'])

        # Adding M2M table for field themes on 'Layer'
        db.create_table('data_manager_layer_themes', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('layer', models.ForeignKey(orm['data_manager.layer'], null=False)),
            ('theme', models.ForeignKey(orm['data_manager.theme'], null=False))
        ))
        db.create_unique('data_manager_layer_themes', ['layer_id', 'theme_id'])


    def backwards(self, orm):
        # Deleting model 'Theme'
        db.delete_table('data_manager_theme')

        # Deleting model 'Layer'
        db.delete_table('data_manager_layer')

        # Removing M2M table for field sublayers on 'Layer'
        db.delete_table('data_manager_layer_sublayers')

        # Removing M2M table for field themes on 'Layer'
        db.delete_table('data_manager_layer_themes')


    models = {
        'data_manager.layer': {
            'Meta': {'object_name': 'Layer'},
            'bookmark': ('django.db.models.fields.CharField', [], {'max_length': '755', 'null': 'True', 'blank': 'True'}),
            'data_download': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'fact_sheet': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_sublayer': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'kml': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'layer_type': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'legend': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'map_tiles': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'metadata': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'source': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'sublayers': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'sublayers_rel_+'", 'null': 'True', 'to': "orm['data_manager.Layer']"}),
            'themes': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['data_manager.Theme']", 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'utfurl': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        'data_manager.theme': {
            'Meta': {'object_name': 'Theme'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['data_manager']