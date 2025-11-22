from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")

API_BASE = "https://api.football-data.org"
API_VERSION = "v4"

HEADERS = {
    "X-Auth-Token": API_KEY
}

app = FastAPI(title="Football Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def forward(path: str, params: dict = None):
    url = f"{API_BASE}/{path}"
    response = requests.get(url, headers=HEADERS, params=params)
    return response.json()


# ------------------------------
#           AREAS
# ------------------------------

@app.get("/areas")
def get_areas():
    return forward(f"{API_VERSION}/areas")

@app.get("/areas/{area_id}")
def get_area(area_id: int):
    return forward(f"{API_VERSION}/areas/{area_id}")


# ------------------------------
#       COMPETITIONS
# ------------------------------

@app.get("/competitions")
def get_competitions(areas: str | None = None):
    params = {"areas": areas} if areas else None
    return forward(f"{API_VERSION}/competitions", params)

@app.get("/competitions/{competition_id}")
def get_competition(competition_id: str):
    return forward(f"{API_VERSION}/competitions/{competition_id}")


@app.get("/competitions/{competition_id}/standings")
def get_standings(
    competition_id: str,
    matchday: int | None = None,
    season: int | None = None,
    date: str | None = None
):
    params = {
        "matchday": matchday,
        "season": season,
        "date": date,
    }
    params = {k: v for k, v in params.items() if v is not None}
    return forward(f"{API_VERSION}/competitions/{competition_id}/standings", params)


@app.get("/competitions/{competition_id}/matches")
def get_competition_matches(
    competition_id: str,
    dateFrom: str | None = None,
    dateTo: str | None = None,
    stage: str | None = None,
    status: str | None = None,
    matchday: int | None = None,
    group: str | None = None,
    season: int | None = None
):
    params = {k: v for k, v in locals().items() if k != "competition_id" and v is not None}
    return forward(f"{API_VERSION}/competitions/{competition_id}/matches", params)


@app.get("/competitions/{competition_id}/teams")
def get_competition_teams(competition_id: str, season: int | None = None):
    params = {"season": season} if season else None
    return forward(f"{API_VERSION}/competitions/{competition_id}/teams", params)


@app.get("/competitions/{competition_id}/scorers")
def get_scorers(competition_id: str, limit: int | None = None, season: int | None = None):
    params = {k: v for k, v in {"limit": limit, "season": season}.items() if v is not None}
    return forward(f"{API_VERSION}/competitions/{competition_id}/scorers", params)


# ------------------------------
#              TEAMS
# ------------------------------

@app.get("/teams")
def list_teams(limit: int | None = None, offset: int | None = None):
    params = {k: v for k, v in {"limit": limit, "offset": offset}.items() if v is not None}
    return forward(f"{API_VERSION}/teams", params)

@app.get("/teams/{team_id}")
def get_team(team_id: int):
    return forward(f"{API_VERSION}/teams/{team_id}")

@app.get("/teams/{team_id}/matches")
def get_team_matches(
    team_id: int,
    dateFrom: str | None = None,
    dateTo: str | None = None,
    season: int | None = None,
    competitions: str | None = None,
    status: str | None = None,
    venue: str | None = None,
    limit: int | None = None
):
    params = {k: v for k, v in locals().items() if k != "team_id" and v is not None}
    return forward(f"{API_VERSION}/teams/{team_id}/matches", params)


# ------------------------------
#              PERSONS
# ------------------------------

@app.get("/persons/{person_id}")
def get_person(person_id: int):
    return forward(f"{API_VERSION}/persons/{person_id}")

@app.get("/persons/{person_id}/matches")
def get_person_matches(
    person_id: int,
    dateFrom: str | None = None,
    dateTo: str | None = None,
    status: str | None = None,
    competitions: str | None = None,
    limit: int | None = None,
    offset: int | None = None,
):
    params = {k: v for k, v in locals().items() if k != "person_id" and v is not None}
    return forward(f"{API_VERSION}/persons/{person_id}/matches", params)


# ------------------------------
#              MATCHES
# ------------------------------

@app.get("/matches/{match_id}")
def get_match(match_id: int):
    return forward(f"{API_VERSION}/matches/{match_id}")

@app.get("/matches")
def list_matches(
    competitions: str | None = None,
    ids: str | None = None,
    dateFrom: str | None = None,
    dateTo: str | None = None,
    status: str | None = None
):
    params = {k: v for k, v in locals().items() if v is not None}
    return forward(f"{API_VERSION}/matches", params)

@app.get("/matches/{match_id}/head2head")
def get_head2head(
    match_id: int,
    limit: int | None = None,
    dateFrom: str | None = None,
    dateTo: str | None = None,
    competitions: str | None = None
):
    params = {k: v for k, v in locals().items() if k != "match_id" and v is not None}
    return forward(f"{API_VERSION}/matches/{match_id}/head2head", params)
