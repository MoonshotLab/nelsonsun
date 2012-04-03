from django.conf.urls.defaults import patterns, include, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^totals/$', 'kiosk.views.totals', name='kiosk_totals'),
    url(r'^upload/$', 'kiosk.views.upload', name='kiosk_upload'),
    url(r'^solar/$', 'kiosk.views.solar', name='kiosk_solar'),
)
