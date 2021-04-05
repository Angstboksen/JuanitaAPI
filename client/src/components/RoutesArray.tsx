import JSONPretty from "react-json-pretty";
import { baseURL } from "../api";

const botLink = "https://github.com/Angstboksen/JuanitaMusic";

export enum RouteEnum {
  INITIAL = "initial",
  BASE = "base",
  STATS_BASE = "stats_base",
  STATS_PLAYTIME = "stats_playtime",
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
            to walk through the dataset collected by the{" "}
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
                <ul>
                  <li>
                    <code>/playtime</code> Total playtime
                  </li>
                </ul>
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
          <h3>Possible HTTP responses</h3>
          <h4>
            <code className="get green">200 OK</code>
          </h4>
          <p>
            Indicating that everything went well, and the data was retrieved.
          </p>
          <h4>
            <code className="get orange">204 No Content</code>
          </h4>
          <p>
            Indicating that everything went well, but no data is stored for the
            provided user.
          </p>
          <h4>
            <code className="get red">400 Bad Request</code>
          </h4>
          <p>
            Indicating that the request you sent was not something the server
            recognized.
          </p>
          <h4>
            <code className="get red">404 Not Found</code>
          </h4>
          <p>
            Indicating that the request went through, but no data could be
            fetched from that endpoint.
          </p>
          <h4>
            <code className="get red">500 Internal Sever Error</code>
          </h4>
          <p>Indicating that something is wrong on the server side.</p>
        </div>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.BASE,
    base: "/",
    description: (
      <div>
        <h3>
          <span className="orange-text">Base:</span> Home
        </h3>
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
        <h4>
          Return type: <code>Object</code>
        </h4>

        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.STATS_BASE,
    base: "/stats",
    description: (
      <div>
        <h3>
          <span className="orange-text">Stats:</span> Base endpoint for stats
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/stats`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want some overall stats
            about Juanita's data.
          </span>{" "}
          The endpoint will return an object with miscellaneous statistics for
          the data fetched by Juanita. This endpoint is constantly updating as
          new sets of data are created constantly.{" "}
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
            playtime: {
              seconds: "number",
              readable: "string",
            },
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.STATS_PLAYTIME,
    base: "/stats/playtime",
    description: (
      <div>
        <h3>
          <span className="orange-text">Stats:</span> Total playtime
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/stats/playtime`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to know the total
            playtime of Juanita.
          </span>{" "}
          Whenever a search is stored, Juanita also stores the length of that
          song. This is added to a total which can be retrieved at this
          endpoint.{" "}
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
            seconds: "number",
            readable: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_BASE,
    base: "/songs",
    description: (
      <div>
        <h3>
          <span className="orange-text">Songs:</span> Base endpoint for songs
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/songs`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve songs
            played by Juanita.
          </span>{" "}
          The endpoint will return an array of songs. If a limit is not set, it
          will retrieve all songs ever played by Juanita. This array is a set -
          meaning that no song is represented twice.{" "}
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
            url: "string",
            seconds: "number",
            title: "string",
            thumbnail: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array / Set</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.SONGS_SOTD,
    base: "/songs/sotd",
    description: (
      <div>
        <h3>
          <span className="orange-text">Songs:</span> Song of the day
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/songs/sotd`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve the
            song of the day.
          </span>{" "}
          Every day at midnight, Juanita picks a random song out of all songs
          ever played and sets it as the "Song of the day". This endpoint will
          retrieve this song.{" "}
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
            url: "string",
            seconds: "number",
            title: "string",
            thumbnail: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_SOTW,
    base: "/songs/sotw",
    description: (
      <div>
        <h3>
          <span className="orange-text">Songs:</span> Song of the week
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/songs/sotw`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve the
            song of the week.
          </span>{" "}
          Every monday, Juanita picks a random song out of all songs ever played
          and sets it as the "Song of the week". This endpoint will retrieve
          this song.{" "}
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
            url: "string",
            seconds: "number",
            title: "string",
            thumbnail: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_SOTM,
    base: "/songs/sotm",
    description: (
      <div>
        <h3>
          <span className="orange-text">Songs:</span> Song of the month
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/songs/sotm`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve the
            song of the month.
          </span>{" "}
          Every 1st of every month, Juanita picks a random song out of all songs
          ever played and sets it as the "Song of the month". This endpoint will
          retrieve this song.{" "}
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
            url: "string",
            seconds: "number",
            title: "string",
            thumbnail: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.SONGS_RANDOM,
    base: "/songs/random",
    description: (
      <div>
        <h3>
          <span className="orange-text">Songs:</span> Random song
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/songs/random`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve a
            random song from the dataset.
          </span>{" "}
          Juanita has played hundreds of different songs since she started
          jamming. This endpoint will return one of these songs - at random.{" "}
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
            url: "string",
            seconds: "number",
            title: "string",
            thumbnail: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.SEARCHES_BASE,
    base: "/searches",
    description: (
      <div>
        <h3>
          <span className="orange-text">Searches:</span> Base endpoint for
          searches
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/searches`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve stored
            searches for songs.
          </span>{" "}
          Whenever a Discord user plays a song with Juanita, she stores the song
          and links it to the user. This makes it possible to have a link
          between the user and songs played. This endpoint will retrieve the
          whole dataset, if not a limit is set.
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
            title: "string",
            date: "date",
            requestor: {
              tag: "string",
              id: "string",
            },
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.SEARCHES_USER,
    base: "/searches/<discord_id: string>",
    description: (
      <div>
        <h3>
          <span className="orange-text">Searches:</span> User spesific searches
        </h3>
        <h4>
          Endpoint format:{" "}
          <code>{`${baseURL}/searches/<discord_id: string>`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve
            searches for a spesific user, and not the whole set.
          </span>{" "}
          Just like the base part of this endpoint, this one will retrieve
          searches. This one however will return only the searches for a
          spesific user. The searches will filter on the provided Discord user
          id. If no limit is set, all of the searches for the user will be
          retrieved.
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
            title: "string",
            date: "date",
            requestor: {
              tag: "string",
              id: "string",
            },
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get orange">204 No Content</code>
        </h4>
        <p>
          Indicating that everything went well, but no data is stored for the
          provided user.
        </p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.REQUESTORS_BASE,
    base: "/requestors",
    description: (
      <div>
        <h3>
          <span className="orange-text">Requestors:</span> Base endpoint for
          requestors
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/requestors`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve all
            Discord users Juanita has stored.
          </span>{" "}
          To be able to connect a Discord user to a search, Juanita stores the
          users name tag and user id. This endpoint will retrieve all stored
          requestors, if no limit is set.
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
            tag: "string",
            id: "string",
            plays: "number",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.REQUESTORS_TOPSONGS,
    base: "/requestors/<discord_id: string>/topsongs",
    description: (
      <div>
        <h3>
          <span className="orange-text">Requestors:</span> Top 10 searches for a
          user
        </h3>
        <h4>
          Endpoint format:{" "}
          <code>{`${baseURL}/requestors/<discord_id: string>/topsongs`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve a users
            top <code>10</code> searches.
          </span>{" "}
          The songs are sorted on playcount, and the set will never be larger
          than <code>10</code> items. You can however set a limit. A limit of{" "}
          <code>2</code> will retrieve the top <code>2</code> searches for the
          user.
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
            title: "string",
            date: "date",
            requestor: {
              tag: "string",
              id: "string",
            },
            plays: "number",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array / Set</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get orange">204 No Content</code>
        </h4>
        <p>
          Indicating that everything went well, but no data is stored for the
          provided user.
        </p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.REQUESTORS_TOPSONG,
    base: "/requestors/<discord_id: string>/topsong",
    description: (
      <div>
        <h3>
          <span className="orange-text">Requestors:</span> Top search for a user
        </h3>
        <h4>
          Endpoint format:{" "}
          <code>{`${baseURL}/requestors/<discord_id: string>/topsong`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve a users
            top search.
          </span>{" "}
          This endpoint will retrieve the top search for a user. The retrieved
          object will be the same as the first item retrieved by{" "}
          <code>/topsongs</code>.
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
            title: "string",
            date: "date",
            requestor: {
              tag: "string",
              id: "string",
            },
            plays: "number",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Object</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get orange">204 No Content</code>
        </h4>
        <p>
          Indicating that everything went well, but no data is stored for the
          provided user.
        </p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: false,
  },
  {
    name: RouteEnum.REQUESTORS_TOP,
    base: "/requestors/top",
    description: (
      <div>
        <h3>
          <span className="orange-text">Requestors:</span> Top 10 users by count
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/requestors/top`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve the top{" "}
            <code>10</code> most active users.
          </span>{" "}
          This endpoint will retrieve a set of the top <code>10</code> most
          active users. The objects are sorted on how many songs they have
          played with Juanita. The set will never be larger than <code>10</code>{" "}
          items, but you can set a limit just as with <code>/topsongs</code>.
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
            tag: "string",
            id: "string",
            plays: "number",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array / Set</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
  {
    name: RouteEnum.ALIASES_BASE,
    base: "/aliases",
    description: (
      <div>
        <h3>
          <span className="orange-text">Aliases:</span> Base endpoint for
          aliases
        </h3>
        <h4>
          Endpoint format: <code>{`${baseURL}/aliases`}</code>
        </h4>
        <p>
          <span className="bold">
            This is the endpoint you want to use if you want to retrieve the
            aliases for Spotify playlists stored.
          </span>{" "}
          This is a part of the new functionality for Juanita following the
          revamp. Juanita is now able to queue a whole Spotify playlist if the
          user provides the playlist id. If you do not want to find this ID
          every time, you can ask Juanita to store it with an alias. This
          endpoint will list all the aliases currently stored if not a limit is
          set.
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
            alias: "string",
            plid: "string",
            spotify_url: "string",
          }}
        ></JSONPretty>
        <h4>
          Return type: <code>Array / Set</code>
        </h4>
        <h3>Possible HTTP responses</h3>
        <h4>
          <code className="get green">200 OK</code>
        </h4>
        <p>Indicating that everything went well, and the data was retrieved.</p>
        <h4>
          <code className="get red">500 Internal Sever Error</code>
        </h4>
        <p>Indicating that something is wrong on the server side.</p>
      </div>
    ),
    isArray: true,
  },
];

for (const route of routesArray) {
  routesMap.set(route.name, route);
}
