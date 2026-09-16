import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  layout("routes/_app.tsx", [
    index("routes/home.tsx"),
    route("kanban", "routes/kanban.tsx"),
    route("tasks", "routes/tasks.tsx"),
    route("tasks/new", "routes/tasks.new.tsx"),
    route("users", "routes/users.tsx"),
    route("users/new", "routes/users.new.tsx"),
  ]),
] satisfies RouteConfig;
