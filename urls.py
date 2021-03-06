from django.conf import settings
from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),

    url(r'^$', 'kiosk.views.home', name='home'),
    url(r'^kiosk/', include('kiosk.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    url('^(?P<identifier>\w+)$', 'kiosk.views.share', name='kiosk_share'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:],
                'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),

    )
