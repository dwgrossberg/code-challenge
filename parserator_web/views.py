import usaddress
from usaddress import RepeatedLabelError
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ParseError


class Home(TemplateView):
    template_name = 'parserator_web/index.html'


class AddressParse(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        # Address string passed in via request params
        address = request.query_params.get('address')
        # Check that request params have valid structure
        if 'address' not in request.query_params:
            raise ParseError
        # Create the response values
        try:
            address_components, address_type = self.parse(address)
            return Response({
                'input_string': address,
                'address_components': address_components,
                'address_type': address_type
            })
        # Handle exceptions and errors
        except (RepeatedLabelError, TypeError):
            return Response({'RepeatedLabelError': 'Unable to parse this value due to '
                            'repeated labels. Our team has been notified of the error.'},
                            status=400)
        except Exception as e:
            return Response({'Error': 'Error ' + e}, status=400)

    def parse(self, address):
        address_components, address_type = usaddress.tag(address)
        return address_components, address_type
