import React, { useEffect } from 'react';
import { Router, Switch, Route, Link, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

import NavBar from './components/NavBar';
import { useAuth0 } from './react-auth0-spa';
import isAdmin from './lib/admin';

import './App.css';
import {
  projects,
  creditsIssuer,
  purchasedCredits,
  projectDefault,
  Project,
  PurchasedCredits,
} from './mocks';
import Footer from 'web-components/lib/components/footer';
import Header from 'web-components/lib/components/header';
import Title from 'web-components/lib/components/title';
import ProjectDetails from './components/ProjectDetails';
import ProjectList from './components/ProjectList';
import UserCredits from './components/UserCredits';
import CreditsIssue from './components/CreditsIssue';
import CreditsTransfer from './components/CreditsTransfer';
import BuyerCreate from './components/BuyerCreate';
import history from './lib/history';

function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Home(): JSX.Element {
  const { user } = useAuth0();

  return (
    <div style={{ paddingLeft: '1rem' }}>
      <p>
        <Link to="/projects">Project list</Link>
      </p>
      <p>
        <Link to="/credits/userId">Credits page</Link>
      </p>
      {isAdmin(user) && (
        <div>
          Admin:
          <p>
            <Link to="/admin/credits/issue">Issue credits</Link>
          </p>
          <p>
            <Link to="/admin/credits/transfer">Transfer credits</Link>
          </p>
          <p>
            <Link to="/admin/buyer/create">Create Buyer</Link>
          </p>
        </div>
      )}
    </div>
  );
}

function CreditsContainer(): JSX.Element {
  let { userId } = useParams();
  const userCredits: PurchasedCredits | undefined = purchasedCredits.find(p => p.userId === userId);
  if (userCredits) {
    return <UserCredits credits={userCredits} />;
  }
  return <div>User not found</div>;
}

function ProjectContainer(): JSX.Element {
  let { projectId } = useParams();
  const project: Project | undefined = projects.find(p => p.id === projectId);

  if (project) {
    return <ProjectDetails project={project} projectDefault={projectDefault} />;
  }
  return <div>No project found</div>;
}

function Projects(): JSX.Element {
  return <ProjectList projects={projects} />;
}

function VerifyEmail(): JSX.Element {
  const search = new URLSearchParams(window.location.search);
  return (
    <div style={{ padding: '1rem' }}>
      <Title variant="h3">Please confirm your email address</Title>
      We’ve just sent a confirmation email to: {search.get('email')}
    </div>
  );
}

function PostPurchase(): JSX.Element {
  return (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <Title variant="h1">Thank you for your purchase</Title>
    </div>
  );
}

// function Admin(): JSX.Element {
//   return (
//     <div style={{ paddingLeft: '1rem' }}>
//       <p>
//         <Link to="/admin/credits/issue">Issue Credits</Link>
//       </p>
//     </div>
//   );
// }

const App: React.FC = (): JSX.Element => {
  const { user, loading } = useAuth0();
  const theme = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router history={history}>
      <ScrollToTop />
      <div>
        <Header color={theme.palette.primary.light} transparent={false} absolute={false}>
          <NavBar />
        </Header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/verify-email">
            <VerifyEmail />
          </Route>
          <Route
            path="/projects"
            render={({ match: { path } }) => (
              <>
                <Route path={`${path}`} component={Projects} exact />
                <Route path={`${path}/:projectId`} component={ProjectContainer} />
              </>
            )}
          />
          <Route
            path="/post-purchase"
            render={({ match: { path } }) => (
              <>
                <Route path={`${path}/:projectId`} component={PostPurchase} />
              </>
            )}
          />
          <Route
            path="/credits"
            render={({ match: { path } }) => (
              <>
                <Route path={`${path}/:projectId`} component={CreditsContainer} />
              </>
            )}
          />
          {isAdmin(user) && (
            <Route
              path="/admin"
              render={({ match: { path } }) => (
                <>
                  <Route path={`${path}/credits/issue`} component={CreditsIssue} />
                  <Route path={`${path}/credits/transfer`} component={CreditsTransfer} />
                  <Route path={`${path}/buyer/create`} component={BuyerCreate} />
                </>
              )}
            />
          )}
        </Switch>
        <footer>
          <Footer user={creditsIssuer} />
        </footer>
      </div>
    </Router>
  );
};

export default App;