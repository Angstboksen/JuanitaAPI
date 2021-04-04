import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MergeTypeTwoToneIcon from "@material-ui/icons/MergeTypeTwoTone";
import InteractiveForm from "./InteractiveForm";
import RouteInformation from "./RouteInformation";
import Picture from "../media/juanita.png";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { RouteEnum, routesMap } from "./RoutesArray";

const drawerWidth = "48%";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#FF7F50",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
}));

type Props = {
  updateUrl: (url: string, limit?: string) => void;
  overrideUrl: (url: string) => void;
  execute: () => void;
  url: string;
};

const DrawerContainer: React.FC<Props> = ({
  execute,
  updateUrl,
  overrideUrl,
  url,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<MiniRoute>({
    route: "/",
    enum: RouteEnum.INITIAL,
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleRouteClick = (route: MiniRoute) => {
    setRoute(route);
    updateUrl(routesMap.get(route.enum)!.base);
    handleDrawerClose();
  };

  return (
    <ClickAwayListener onClickAway={handleDrawerClose}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="inherit" noWrap>
              <img src={Picture} alt="Juanita" />
            </Typography>
            <Typography
              variant="h6"
              noWrap
              className="main-header"
              onClick={() =>
                handleRouteClick({ route: "/", enum: RouteEnum.INITIAL })
              }
            >
              Juanita API
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <h2>Endpoints</h2>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <h4 className="margin-15">Information</h4>
            {[{ route: "/", enum: RouteEnum.INITIAL }].map(
              (route: MiniRoute, index: number) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleRouteClick(route)}
                >
                  <ListItemIcon>
                    <MergeTypeTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Information page" />
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Base</h4>
            {[{ route: "/", enum: RouteEnum.BASE }].map(
              (route: MiniRoute, index: number) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleRouteClick(route)}
                >
                  <ListItemIcon>
                    <MergeTypeTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={route.route} />
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Stats</h4>
            {[{ route: "/stats", enum: RouteEnum.STATS_BASE }].map(
              (route: MiniRoute, index: number) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleRouteClick(route)}
                >
                  <ListItemIcon>
                    <MergeTypeTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={route.route} />
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Songs</h4>
            {[
              { route: "/songs", enum: RouteEnum.SONGS_BASE },
              { route: "/songs/sotd", enum: RouteEnum.SONGS_SOTD },
              { route: "/songs/sotw", enum: RouteEnum.SONGS_SOTW },
              { route: "/songs/sotm", enum: RouteEnum.SONGS_SOTM },
              { route: "/songs/random", enum: RouteEnum.SONGS_RANDOM },
            ].map((route: MiniRoute, index: number) => (
              <ListItem
                button
                key={index}
                onClick={() => handleRouteClick(route)}
              >
                <ListItemIcon>
                  <MergeTypeTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary={route.route} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Searches</h4>
            {[
              { route: "/searches", enum: RouteEnum.SEARCHES_BASE },
              {
                route: "/searches/<discord_id>",
                enum: RouteEnum.SEARCHES_USER,
              },
            ].map((route: MiniRoute, index: number) => (
              <ListItem
                button
                key={index}
                onClick={() => handleRouteClick(route)}
              >
                <ListItemIcon>
                  <MergeTypeTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary={route.route} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Requestors</h4>
            {[
              { route: "/requestors", enum: RouteEnum.REQUESTORS_BASE },
              {
                route: "/requestors/<discord_id>/topsongs",
                enum: RouteEnum.REQUESTORS_TOPSONGS,
              },
              {
                route: "/requestors/<discord_id>/topsong",
                enum: RouteEnum.REQUESTORS_TOPSONG,
              },
              { route: "/requestors/top", enum: RouteEnum.REQUESTORS_TOP },
            ].map((route: MiniRoute, index: number) => (
              <ListItem
                button
                key={index}
                onClick={() => handleRouteClick(route)}
              >
                <ListItemIcon>
                  <MergeTypeTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary={route.route} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <h4 className="margin-15">Aliases</h4>
            {[{ route: "/aliases", enum: RouteEnum.ALIASES_BASE }].map(
              (route: MiniRoute, index: number) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleRouteClick(route)}
                >
                  <ListItemIcon>
                    <MergeTypeTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={route.route} />
                </ListItem>
              )
            )}
          </List>
          <Divider />
        </Drawer>
        <div className="form-route-wraper">
          <RouteInformation route={route} />
          <InteractiveForm
            execute={execute}
            updateUrl={updateUrl}
            overrideUrl={overrideUrl}
            url={url}
            route={route}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default DrawerContainer;
