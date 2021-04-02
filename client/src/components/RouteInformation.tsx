import React from "react";

export enum RouteEnum {
  INITIAL = "initial",
  BASE = "base",
  STATS_BASE = "stats_base",
  ALIASES_BASE = "aliases_base",
  SONGS_BASE = "songs_base",
  SEARCHES_BASE = "searches_base",
  REQUESTORS_BASE = "requestors_base",
}

type Props = {
  route: RouteEnum;
};

const RouteInformation: React.FC<Props> = ({ route }) => {
  const display = routes.get(route);
  const initialRoute = routes.get(RouteEnum.INITIAL);
  return (
    <div className="route-information">
      <div>{display ? display.description : initialRoute?.description}</div>
    </div>
  );
};

const botLink = "https://github.com/Angstboksen/JuanitaMusic";

const routes = new Map<string, Route>();
const routesArray = [
  {
    name: RouteEnum.INITIAL,
    base: "/",
    description: (
      <div>
        <div>
          <h2>Introduction</h2>
          <p>
            Welcome to the reference for the Juanita API. This makes it possible
            to walk though the dataset collected by the{" "}
            <a href={botLink} target="_blank" rel="noreferrer">
              Discord bot
            </a>{" "}
            and view all kinds of stats related to it.
          </p>
          <p>
            Whenever a Discord user plays a song via Juanita, she will store the
            song in a persistent database. She will also store the search
            itself, connecting the user and the song. This makes it possible to
            get user spesific data because of how the data is structured. You
            can for example find out what a users favorite song to play is, or
            how many times the user has played a song with Juanita. The
            possibilities are endless with open data.
          </p>
        </div>
        <div>
          <h3>Endpoints</h3>
          <p>
            All requests go to <code>https://juanitaapi.herokuapp.com</code>:
            <ul>
              <li>
                <code>/</code> Some information about the API
              </li>
              <li>
                <code>/stats</code> Stats about the bot
              </li>
              <li>
                <code>/songs</code> All songs ever played with Juanita
                <ul>
                  <li>
                    <code>/sotd</code> Song of the day
                  </li>
                  <li>
                    <code>/sotw</code> Song of the week
                  </li>
                  <li>
                    <code>/sotm</code> Song of the month
                  </li>
                  <li>
                    <code>/random</code> Random song from all played songs
                  </li>
                </ul>
              </li>
              <li>
                <code>/searches</code> All searches ever searched with Juanita
                <ul>
                  <li>
                    <code>
                      /<span className="blue">{"<discord_id : string>"}</span>
                    </code>{" "}
                    All searches for a spesific users
                  </li>
                </ul>
              </li>
              <li>
                <code>/requestors</code> All users who have searched for a song
                <ul>
                  <li>
                    <code>
                      /<span className="blue">{"<discord_id : string>"}</span>
                      /topsongs
                    </code>{" "}
                    Top 10 songs for a user
                  </li>
                  <li>
                    <code>
                      /<span className="blue">{"<discord_id : string>"}</span>
                      /topsong
                    </code>{" "}
                    Top song for a user
                  </li>
                  <li>
                    <code>/top</code> Top 10 users by search count
                  </li>
                </ul>
              </li>
              <li>
                <code>/aliases</code> All aliases of Spotify playlists
              </li>
            </ul>
            All variables (such as a users Discord id) are inside brackets, and
            colored <span className="blue">blue</span>.
            <br /> <br />A more detailed description about each endpoint can be
            found by opening the menu on the left hand side.An explanation will
            be given about what needs to be done to fetch the data you need.
          </p>
          <p>
            The API only accepts <code>GET</code> requests, meaning that you are
            not able to alter any stored data by using this interactive part of
            the API.
          </p>
        </div>
        <div>
          <h3>Limiting</h3>
          <p>
            When sending requests, you are able to limit how large you want the
            returned list of objects to be. This is done by adding a query
            parameter to your endpoint URL. You can see an example of this below
            - where the request limits the size of the returned data to{" "}
            <code>20</code>.
          </p>
          <p>
            <code>
              https://juanitaapi.herokuapp.com/songs/
              <span className="blue">?limit=20</span>
            </code>
            <br />
            The returned data will then have a maximum length of{" "}
            <code className="blue">20</code>.
          </p>
        </div>
        <div>
          <h3>Extra information</h3>
          <p>
            The API is written in TypeScript making use of the Express library.
            Currently, the API itself is hosted on{" "}
            <a
              href="https://juanitaapi.herokuapp.com/"
              target="_blank"
              rel="noreferrer"
            >
              Heroku
            </a>{" "}
            while this page is hosted via Firebase. You can find the source code
            for both the API and Juanita herself on{" "}
            <a
              href="https://github.com/Angstboksen"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
            <ul>
              <li>
                <a
                  href="https://github.com/Angstboksen/JuanitaMusic"
                  target="_blank"
                  rel="noreferrer"
                >
                  JuanitaMusic Discord bot
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Angstboksen/JuanitaAPI"
                  target="_blank"
                  rel="noreferrer"
                >
                  Juanita API
                </a>
              </li>
            </ul>
          </p>
        </div>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.BASE,
    base: "/",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.STATS_BASE,
    base: "/stats",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.SONGS_BASE,
    base: "/songs",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.SEARCHES_BASE,
    base: "/searches",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.REQUESTORS_BASE,
    base: "/requestors",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
  {
    name: RouteEnum.ALIASES_BASE,
    base: "/aliases",
    description: (
      <div>
        <h3>Introduction</h3>
        <p>
          Welcome to the reference for the Juanita API. This makes it possible
          to crawl though the dataset collected by the
          <a href={botLink}> Discord bot </a> and view all kinds of stats
          related to it.
        </p>
      </div>
    ),
    format: {
      name: "string",
      type: "string",
      date: "date",
      author: "string",
      github_repository: "string",
      discord_bot: "string",
      invite_link: "string",
    },
  },
];

routes.set(RouteEnum.INITIAL, routesArray[0]);
routes.set(RouteEnum.BASE, routesArray[1]);
routes.set(RouteEnum.STATS_BASE, routesArray[2]);
routes.set(RouteEnum.SONGS_BASE, routesArray[3]);
routes.set(RouteEnum.SEARCHES_BASE, routesArray[4]);
routes.set(RouteEnum.REQUESTORS_BASE, routesArray[5]);

export default RouteInformation;
