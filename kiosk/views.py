import hashlib
from decimal import Decimal
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from kiosk.models import Result

def share(request, identifier):
    """Displays the user's infographic with share links."""
    result = get_object_or_404(Result, identifier=identifier)
    return render_to_response('kiosk/share.html', {
        'result': result,
        'url': request.build_absolute_uri(reverse('kiosk_share',
                                                  args=[identifier])),
    }, context_instance=RequestContext(request))

def totals(request):
    """Returns the kiosk total summary."""
    return HttpResponse('users=124&average_power=32.14&total_energy=18.56',
                        mimetype='text/plain')

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