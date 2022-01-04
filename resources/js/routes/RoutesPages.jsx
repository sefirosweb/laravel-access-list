import { Switch, Route } from "react-router-dom";

/* Pages */
import NotFound from "@/pages/NotFound";
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import AccessList from "@/pages/AccessList";



function RoutesPages() {
    return (
        <Switch>
            <Route exact path={`/${APP_PREFIX}/view/users`} component={Users} />
            <Route exact path={`/${APP_PREFIX}/view/roles`} component={Roles} />
            <Route exact path={`/${APP_PREFIX}/view/access_list`} component={AccessList} />

            <Route component={NotFound} />
        </Switch>
    );
}

export default RoutesPages;
