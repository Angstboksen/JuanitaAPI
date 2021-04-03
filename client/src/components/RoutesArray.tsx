import JSONPretty from "react-json-pretty";
import { baseURL } from "../api";

const botLink = "https://github.com/Angstboksen/JuanitaMusic";

export enum RouteEnum {
  INITIAL = "initial",
  BASE = "base",
  STATS_BASE = "stats_base",
  ALIASES_BASE = "aliases_base",
  SONGS_BASE = "songs_base",
  SONGS_SOTD = "songs_sotd",
  SONGS_SOTW = "songs_sotw",
  SONGS_SOTM = "songs_sotm",
  SONGS_RANDOM = "songs_random",
  SEARCHES_BASE = "searches_base",
  SEARCHES_USER = "searches_user",
  REQUESTORS_BASE = "requestors_base",
  REQUESTORS_TOPSONGS = "requestors_topsongs",
  REQUESTORS_TOPSONG = "requestors_topsong",
  REQUESTORS_TOP = "requestors_user",
}

export const routesMap = new Map<string, Route>();
const routesArray: Route[] = [
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
          <div>
            All requests go to <code>https://juanitaapi.herokuapp.com</code>
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
                      /
                      <span className="blue-text">
                        {"<discord_id : string>"}
                      </span>
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
                      /
                      <span className="blue-text">
                        {"<discord_id : string>"}
                      </span>
                      /topsongs
                    </code>{" "}
                    Top 10 songs for a user
                  </li>
                  <li>
                    <code>
                      /
                      <span className="blue-text">
                        {"<discord_id : string>"}
                      </span>
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
            colored <span className="blue-text">blue</span>.
            <br /> <br />A more detailed description about each endpoint can be
            found by opening the menu on the left hand side. An explanation will
            be given about what needs to be done to fetch the data you need.
          </div>
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
              <span className="blue-text">?limit=20</span>
            </code>
            <br />
            The returned data will then have a maximum length of{" "}
            <code className="blue-text">20</code>.
          </p>
        </div>
        <div>
          <h3>Extra information</h3>
          <div>
            <p>
              The API is written in TypeScript making use of the Express
              library. Currently, the API itself is hosted on{" "}
              <a
                href="https://juanitaapi.herokuapp.com/"
                target="_blank"
                rel="noreferrer"
              >
                Heroku
              </a>{" "}
              while this page is hosted via Firebase. You can find the source
              code for both the API and Juanita herself on{" "}
              <a
                href="https://github.com/Angstboksen"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </p>
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
          </div>
          <h3>Custom request</h3>
          <p>
            Below you can make your own request by typing it into the input
            field. If you want to use one of the predefined requests, you can do
            that by selecting one from the menu. All you need to do is follow
            the guide for each endpoint description.
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
    isArray: false,
  },
  {
    name: RouteEnum.BASE,
    base: "/",
    description: (
      <div>
        <h3>Base endpoint</h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/`}</code>
        </h4>
        <p>
          This endpoint serves as a placeholder for information about the API
          and Discord bot. It will not contain any data stored by Juanita, or
          anything else linked to a spesific user.
        </p>
        <h4>Data format</h4>
        <p>
          Below you can see the format of the data returned by this endpoint.
          The name of the attibute will be colored in{" "}
          <span className="purple-text">purple</span>, and the type in{" "}
          <span className="orange-text">orange</span>.
        </p>
        <JSONPretty
          className="pretty-json"
          data={{
            name: "string",
            type: "string",
            date: "date",
            author: "string",
            github_repository: "string",
            discord_bot: "string",
            invite_link: "string",
          }}
        ></JSONPretty>
        <h4>Return type: <code>Object</code></h4>
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
    isArray: false,
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
    isArray: false,
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
    isArray: true,
  },
  {
    name: RouteEnum.SONGS_SOTD,
    base: "/songs/sotd",
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
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_SOTW,
    base: "/songs/sotw",
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
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_SOTM,
    base: "/songs/sotm",
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
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_RANDOM,
    base: "/songs/random",
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
    isArray: false,
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
    isArray: true,
  },
  {
    name: RouteEnum.SEARCHES_USER,
    base: "/searches/<discord_id: string>",
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
    isArray: true,
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
    isArray: true,
  },
  {
    name: RouteEnum.REQUESTORS_TOPSONGS,
    base: "/requestors/<discord_id: string>/topsongs",
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
    isArray: true,
  },
  {
    name: RouteEnum.REQUESTORS_TOPSONG,
    base: "/requestors/<discord_id: string>/topsong",
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
    isArray: false,
  },
  {
    name: RouteEnum.REQUESTORS_TOP,
    base: "/requestors/top",
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
    isArray: true,
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
    isArray: true,
  },
];

for (const route of routesArray) {
  routesMap.set(route.name, route);
}
