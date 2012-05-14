# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding field 'LeaseBlock.awc_min_distance'
        db.add_column('scenarios_leaseblock', 'awc_min_distance', self.gf('django.db.models.fields.FloatField')(null=True, blank=True), keep_default=False)

        # Adding field 'LeaseBlock.awc_max_distance'
        db.add_column('scenarios_leaseblock', 'awc_max_distance', self.gf('django.db.models.fields.FloatField')(null=True, blank=True), keep_default=False)

        # Adding field 'LeaseBlock.awc_avg_distance'
        db.add_column('scenarios_leaseblock', 'awc_avg_distance', self.gf('django.db.models.fields.FloatField')(null=True, blank=True), keep_default=False)

        # Adding field 'LeaseBlock.wea_number'
        db.add_column('scenarios_leaseblock', 'wea_number', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True), keep_default=False)

        # Adding field 'LeaseBlock.wea_name'
        db.add_column('scenarios_leaseblock', 'wea_name', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'LeaseBlock.awc_min_distance'
        db.delete_column('scenarios_leaseblock', 'awc_min_distance')

        # Deleting field 'LeaseBlock.awc_max_distance'
        db.delete_column('scenarios_leaseblock', 'awc_max_distance')

        # Deleting field 'LeaseBlock.awc_avg_distance'
        db.delete_column('scenarios_leaseblock', 'awc_avg_distance')

        # Deleting field 'LeaseBlock.wea_number'
        db.delete_column('scenarios_leaseblock', 'wea_number')

        # Deleting field 'LeaseBlock.wea_name'
        db.delete_column('scenarios_leaseblock', 'wea_name')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 5, 14, 11, 32, 20, 860000)'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 5, 14, 11, 32, 20, 860000)'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'scenarios.kmlcache': {
            'Meta': {'object_name': 'KMLCache'},
            'date_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'val': ('picklefield.fields.PickledObjectField', [], {})
        },
        'scenarios.leaseblock': {
            'Meta': {'object_name': 'LeaseBlock'},
            'avg_depth': ('django.db.models.fields.FloatField', [], {}),
            'avg_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'awc_avg_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'awc_max_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'awc_min_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'block_number': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True', 'blank': 'True'}),
            'geometry': ('django.contrib.gis.db.models.fields.MultiPolygonField', [], {'srid': '99996', 'null': 'True', 'blank': 'True'}),
            'geometry_client': ('django.contrib.gis.db.models.fields.MultiPolygonField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'majority_sediment': ('django.db.models.fields.CharField', [], {'max_length': '35', 'null': 'True', 'blank': 'True'}),
            'majority_substrate': ('django.db.models.fields.CharField', [], {'max_length': '35', 'null': 'True', 'blank': 'True'}),
            'max_depth': ('django.db.models.fields.FloatField', [], {}),
            'max_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'max_wind_speed': ('django.db.models.fields.FloatField', [], {}),
            'min_depth': ('django.db.models.fields.FloatField', [], {}),
            'min_distance': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'min_wind_speed': ('django.db.models.fields.FloatField', [], {}),
            'prot_aprv': ('django.db.models.fields.CharField', [], {'max_length': '11', 'null': 'True', 'blank': 'True'}),
            'prot_numb': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'}),
            'prot_number': ('django.db.models.fields.CharField', [], {'max_length': '7', 'null': 'True', 'blank': 'True'}),
            'variety_sediment': ('django.db.models.fields.IntegerField', [], {}),
            'variety_substrate': ('django.db.models.fields.IntegerField', [], {}),
            'wea_name': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'wea_number': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'scenarios.objective': {
            'Meta': {'object_name': 'Objective'},
            'color': ('django.db.models.fields.CharField', [], {'default': "'778B1A55'", 'max_length': '8'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '35'})
        },
        'scenarios.parameter': {
            'Meta': {'object_name': 'Parameter'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '35', 'null': 'True', 'blank': 'True'}),
            'objectives': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['scenarios.Objective']", 'null': 'True', 'blank': 'True'}),
            'ordering_id': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'shortname': ('django.db.models.fields.CharField', [], {'max_length': '35', 'null': 'True', 'blank': 'True'})
        },
        'scenarios.scenario': {
            'Meta': {'object_name': 'Scenario'},
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'scenarios_scenario_related'", 'null': 'True', 'to': "orm['contenttypes.ContentType']"}),
            'date_created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'geometry_final_area': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'input_avg_wind_speed': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'input_max_depth': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'input_max_distance_to_shore': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'input_min_depth': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'input_min_distance_to_shore': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'input_parameter_depth': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'input_parameter_distance_to_shore': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'input_parameter_sediment': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'input_parameter_substrate': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'input_parameter_wind_speed': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'input_sediment': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['scenarios.Sediment']", 'null': 'True', 'blank': 'True'}),
            'input_substrate': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['scenarios.Substrate']", 'null': 'True', 'blank': 'True'}),
            'lease_blocks': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': "'255'"}),
            'object_id': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'sharing_groups': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'scenarios_scenario_related'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['auth.Group']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'scenarios_scenario_related'", 'to': "orm['auth.User']"})
        },
        'scenarios.sediment': {
            'Meta': {'object_name': 'Sediment'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'sediment_id': ('django.db.models.fields.IntegerField', [], {}),
            'sediment_name': ('django.db.models.fields.CharField', [], {'max_length': '35'}),
            'sediment_output': ('django.db.models.fields.CharField', [], {'max_length': '55'}),
            'sediment_shortname': ('django.db.models.fields.CharField', [], {'max_length': '35'})
        },
        'scenarios.substrate': {
            'Meta': {'object_name': 'Substrate'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'substrate_id': ('django.db.models.fields.IntegerField', [], {}),
            'substrate_name': ('django.db.models.fields.CharField', [], {'max_length': '35'}),
            'substrate_shortname': ('django.db.models.fields.CharField', [], {'max_length': '35'})
        }
    }

    complete_apps = ['scenarios']
