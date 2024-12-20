from django.urls import path
from . import views

# from .views import assign_card_to_section
urlpatterns = [
    path("api/receive-data/", views.receive_data, name="receive_data"),
    path("api/get-data/", views.get_data, name="get_data"),
    path(
        "api/assign_card/<int:section_id>/",
        views.assign_card_to_section,
        name="assign_card_to_section",
    ),
    path("api/update_card_state/", views.update_card_state, name="update_card_state"),
    path("api/reset_collections/", views.reset_collections, name="reset_collections"),
    path("api/reveal_joker/", views.reveal_joker_card, name="reveal_joker_card"),
    path(
        "api/assign_card_to_section2/<int:section_id>/",
        views.assign_card_to_section2,
        name="assign_card_to_section2",
    ),
    path(
        "api/check-for-new-documents/",
        views.check_for_new_documents,
        name="check_for_new_documents",
    ),
    path(
        "api/assign_card_to_section3/<int:section_id>/",
        views.assign_card_to_section3,
        name="assign_card_to_section3",
    ),
    path(
        "api/assign_card_directly/",
        views.assign_card_directly,
        name="assign_card_directly",
    ),
    path(
        "api/assign_joker_directly/",
        views.assign_joker_directly,
        name="assign_joker_directly",
    ),
    path(
        "api/assign_card_directly2/",
        views.assign_card_directly2,
        name="assign_card_directly2",
    ),
    path(
        "api/assign_card_to_section_A/",
        views.assign_card_to_section_A,
        name="assign_card_to_section_A",
    ),
    path("api/get_joker_value/", views.get_joker_value, name="get_joker_value"),
    path(
        "api/assign_card_to_player/",
        views.assign_card_to_player,
        name="assign_card_to_player",
    ),
    path("api/get_recent_wins/", views.get_recent_wins, name="get_recent_wins"),
    path("api/player-round/", views.player_round, name="player_round"),
    path("api/set-bet/", views.set_bet, name="set_bet"),
    path("api/get-bet/", views.get_bet, name="get_bet"),
    path("api/start_push/", views.start_push, name="start_push"),
    path("api/push_cards/", views.push_cards, name="push_cards"),
    path("api/push_to_mongo/", views.push_to_mongo, name="push_to_mongo"),
    path("api/stop_push/", views.stop_push, name="stop_push"),
    path("api/check-empty/", views.check_empty, name="check_empty"),
    path("api/update_card/", views.update_card, name="update_card"),
    path("api/add_card/", views.add_card, name="add_card"),
]
