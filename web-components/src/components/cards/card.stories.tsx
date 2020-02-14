import * as React from 'react';
import Card from 'web-components/lib/components/cards/Card';
import ProjectDeveloperCard from 'web-components/lib/components/cards/ProjectDeveloperCard';
import ImpactCard from 'web-components/lib/components/cards/ImpactCard';
import { User } from 'web-components/lib/components/user/UserInfo';
import { withKnobs, text, object, number } from '@storybook/addon-knobs';

// import CreditCard, { CreditInfo } from 'web-components/lib/components/cards/CreditCard';
import PurchasedCreditsCard from 'web-components/lib/components/cards/PurchasedCreditsCard';
import CurrentCreditsIcon from 'web-components/lib/components/icons/CurrentCreditsIcon';
import ProjectCard from 'web-components/lib/components/cards/ProjectCard';

export default {
  title: 'Components|Cards',
  component: Card,
  decorators: [withKnobs],
};

const projectDeveloper: User = {
  name: 'Odonata',
  place: {
    city: 'South Melbourne',
    state: 'Victoria',
    country: 'Australia',
  },
  imgSrc: 'http://www.odonata.org.au/wp-content/uploads/2018/01/odinata-logo-only.png',
  description: 'Odonata is a not-for-profit entity supporting biodiversity impact solutions.',
};

const landSteward: User = {
  name: 'Ngarrindjeri Tribe',
  place: {
    state: 'Southern Australia',
    country: 'Australia',
  },
  imgSrc: '/tribe.png',
  description: 'The Ngarrindjeri culture is centered around the lower lakes of the Murray River.',
};

export const projectDeveloperCard = (): JSX.Element => (
  <ProjectDeveloperCard
    projectDeveloper={object('project developer', projectDeveloper)}
    landSteward={object('land steward', landSteward)}
  />
);

export const impactCard = (): JSX.Element => (
  <ImpactCard
    title={text('title', 'Above ground biomass')}
    description={text('description', 'Increasing all living biomass which is located above the ground.')}
    imgSrc="/biomass.png"
  />
);

export const monitoredImpactCard = (): JSX.Element => (
  <ImpactCard
    title={text('title', 'Biodiversity')}
    description={text(
      'description',
      'Healthy ecosystems and rich biodiversity are fundamental to life on our planet.',
    )}
    imgSrc="/biodiversity.png"
    monitored
  />
);

// const creditInfo: CreditInfo = {
//   name: 'REDD+ in the Amazon',
//   description: 'Reduce the emissions from deforestation and forest degradation in the Amazon',
//   imgSrc: '/Polyculture.png',
//   place: 'Brazil',
//   outcome: 'carbon sequestration',
//   numberOfHolders: 1021,
//   numberOfProjects: 25,
//   amount: 70000,
//   totalAmount: 93211,
//   // unit: 'USD'
// };
//
//
// export const creditCard = (): JSX.Element => (
//   <CreditCard credit={creditInfo} onClick={onClick} width="20.5rem" />
// );

function onClick(): void {}

export const projectCard = (): JSX.Element => (
  <ProjectCard
    name={text('name', 'Coorong Project')}
    place={object('place', {
      city: 'Adelaide',
      state: 'South Australia',
      country: 'Australia',
    })}
    area={number('area', 200)}
    areaUnit={text('areaUnit', 'hectares')}
    imgSrc={text('imgSrc', '/coorong.png')}
    developer={object('developer', {
      name: 'Odonata',
      imgSrc: 'http://www.odonata.org.au/wp-content/uploads/2018/01/odinata-logo-only.png',
    })}
    tag="biodiversity"
    onClick={onClick}
  />
);

export const purchasedCreditsCard = (): JSX.Element => (
  <PurchasedCreditsCard
    number={number('number', 3000)}
    description={text('description', 'Credits you purchased')}
    date={text('date', 'Feb 15, 2020')}
    icon={<CurrentCreditsIcon />}
  />
);