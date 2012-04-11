import datetime, hashlib
from decimal import Decimal
from django.conf import settings
from django.core.urlresolvers import reverse
from django.db.models import Avg, Sum
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from kiosk.models import Result, SolarReading

def home(request):
    """Display overall Pavilion info."""
    solar_readings = SolarReading.objects.filter(
        read_time__gte=datetime.date.today())[0::15]
    return render_to_response('home.html', {
        'current_reading':
                SolarReading.objects.latest(field_name='read_time').power,
        'solar_readings': solar_readings,
        'qr_ref': request.GET.get('ref', None),
        'qr_action': "Panel Power Output",
    }, context_instance=RequestContext(request))

def share(request, identifier):
    """Displays the user's infographic with share links."""
    result = get_object_or_404(Result, identifier=identifier)
    return render_to_response('kiosk/share.html', {
        'result': result,
        'url': request.build_absolute_uri(reverse('kiosk_share',
                                                  args=[identifier])),
        'graphic': request.build_absolute_uri('%s%s' % (settings.MEDIA_URL,
                                                    result.graphic)),
        'qr_ref': request.GET.get('ref', None),
        'qr_action': "Share Graphic",
    }, context_instance=RequestContext(request))

def totals(request):
    """Returns the kiosk total summary."""
    results = Result.objects.all()
    totals = results.aggregate(average_power=Avg('average_power'),
                               total_energy=Sum('energy'))
    totals['total_energy'] = Decimal(totals['total_energy'])
    totals['users'] = results.count()
    return render_to_response('kiosk/totals.xml', totals,
                              context_instance=RequestContext(request))

@csrf_exempt
def upload(request):
    """Uploads an infographic result and generates a share page."""
    if request.method == 'POST':
        identifier = request.POST.get('identifier')
        average_power = Decimal(request.POST.get('average_power'))
        graphic = request.FILES.get('graphic')
        energy = average_power/240
        token = request.POST.get('token')
        m = hashlib.md5()
        m.update(settings.API_SECRET)
        m.update(identifier)
        if token == m.hexdigest():
            result = Result(
                identifier=identifier,
                graphic=graphic,
                average_power=average_power,
                energy=energy,
            )
            result.save()
            return HttpResponse('success=%s' % identifier,
                                mimetype='text/plain')
        else:
            raise Http404
    else:
        raise Http404

@csrf_exempt
def solar(request):
    """Saves a solar panel power reading."""
    if request.method == 'POST':
        try:
            solar_reading = SolarReading(power=request.POST.get('power'))
            solar_reading.save()
        except:
            pass
        return HttpResponse('success=1', mimetype='text/plain')
    else:
        raise Http404
