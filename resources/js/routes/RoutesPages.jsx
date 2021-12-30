import { Switch, Route } from "react-router-dom";

/* Pages */
import NotFound from "@/pages/NotFound";
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import AccessList from "@/pages/AccessList";



function RoutesPages() {
    return (
        <Switch>
            <Route path="/acl/view/users" component={Users} />
            <Route path="/acl/view/roles" component={Roles} />
            <Route path="/acl/view/access_list" component={AccessList} />

            <Route component={NotFound} />
        </Switch>
    );
}

export default RoutesPages;
