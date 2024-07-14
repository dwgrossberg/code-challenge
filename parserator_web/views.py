import usaddress
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
        # Create the response values
        try:
            address_components, address_type = self.parse(address)
            return Response({
                'input_string': address,
                'address_components': address_components,
                'address_type': address_type
            })
        # Handle exceptions and errors
        except ParseError:
            return Response({'ParseError': 'Unable to parse this address'}, status=400)
        except TypeError:
            return Response({'TypeError': 'The submitted address does not match the expected type (string)'}, status=400)
        except Exception as e:
            return Response({'Error': e}, status=400)

    def parse(self, address):
        address_components, address_type = usaddress.tag(address)
        return address_components, address_type
