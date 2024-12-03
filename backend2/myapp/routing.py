from django.urls import path
from myapp.consumers import CardConsumer

# Define WebSocket URL patterns
websocket_urlpatterns = [
    path("ws/cards/", CardConsumer.as_asgi()),  # WebSocket endpoint
]
