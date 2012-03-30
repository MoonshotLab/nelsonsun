# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Result'
        db.create_table('kiosk_result', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=5)),
            ('average_power', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2)),
            ('energy', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2)),
            ('creation_time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('kiosk', ['Result'])

    def backwards(self, orm):
        # Deleting model 'Result'
        db.delete_table('kiosk_result')

    models = {
        'kiosk.result': {
            'Meta': {'object_name': 'Result'},
            'average_power': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '2'}),
            'creation_time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'energy': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '5'})
        }
    }

    complete_apps = ['kiosk']