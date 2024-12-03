from channels.generic.websocket import AsyncWebsocketConsumer
import json

class CardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join a group for broadcasting updates
        await self.channel_layer.group_add(
            "card_updates",
            self.channel_name
        )
        await self.accept()
        print("WebSocket connection established")

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            "card_updates",
            self.channel_name
        )
        print("WebSocket connection closed")

    async def send_card_update(self, event):
        # Send card update to WebSocket client
        await self.send(text_data=json.dumps(event["data"]))

    async def receive(self, text_data):
        # Optionally handle data received from clients
        print(f"Received WebSocket data: {text_data}")
