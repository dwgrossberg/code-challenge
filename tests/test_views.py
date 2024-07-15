import json
from django.urls import resolve
import pytest


def test_api_parse_succeeds(client):
    # TODO: Finish this test. Send a request to the API and confirm that the
    # data comes back in the appropriate format.
    address_string = '123 main st chicago il'
    # Validate that the named view matches url path
    resolver = resolve('/api/parse/')
    assert resolver.view_name == 'address-parse'
    # Test that data returns in the correct format
    test_url = '/api/parse/?address=' + address_string
    data_format = {
        'input_string': '123 main st chicago il',
        'address_components':
            {
                'AddressNumber': '123',
                'StreetName': 'main',
                'StreetNamePostType': 'st',
                'PlaceName': 'chicago',
                'StateName': 'il'
            },
        'address_type': 'Street Address'
    }
    response = client.get(test_url)
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data == data_format


def test_api_parse_raises_error(client):
    # TODO: Finish this test. The address_string below will raise a
    # RepeatedLabelError, so ParseAddress.parse() will not be able to parse it.
    address_string = '123 main st chicago il 123 main st'
    test_url = '/api/parse/?input_string=' + address_string
    # Check that RepeatedLabelError is raised
    repeated_label_error = {
        'RepeatedLabelError':
        'Unable to parse this value due to repeated labels. Our team has been notified of the error.'
    }
    response = client.get(test_url)
    response_data = json.loads(response.content)
    assert response.status_code == 400
    assert response_data == repeated_label_error
