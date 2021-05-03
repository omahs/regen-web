import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { gql } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from '@apollo/client';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import OnBoardingSection from 'web-components/lib/components/section/OnBoardingSection';
import OnBoardingCard from 'web-components/lib/components/cards/OnBoardingCard';
import Description from 'web-components/lib/components/description';
import Banner from 'web-components/lib/components/banner';
import ErrorBanner from 'web-components/lib/components/banner/ErrorBanner';
import UserProfileForm, { UserProfileValues } from 'web-components/lib/components/form/UserProfileForm';
import getApiUri from '../lib/apiUri';

const useStyles = makeStyles((theme: Theme) => ({
  resend: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(33, 0, 0),
      fontSize: theme.spacing(4.5),
    },
  },
}));

const messageExpired: string = 'Access expired.';

const GET_USER_PROFILE = gql`
  query UserByEmail($email: String!) {
    userByEmail(email: $email) {
      email
      id
      isAdmin
      phoneNumber
      roleTitle
      partyByPartyId {
        name
        walletId
        description
        image
      }
    }
  }
`;

const UPDATE_USER_BY_EMAIL = gql`
  mutation UpdateUserByEmail($input: UpdateUserByEmailInput!) {
    updateUserByEmail(input: $input) {
      user {
        partyId
      }
    }
  }
`;

const UPDATE_PARTY_BY_ID = gql`
  mutation UpdatePartyById($input: UpdatePartyByIdInput!) {
    updatePartyById(input: $input) {
      party {
        id
      }
    }
  }
`;

export default function UserProfile(): JSX.Element {
  const { user } = useAuth0();
  const userEmail = user?.email;

  // Get any URL parameters from auth0 after email verification
  const search = new URLSearchParams(window.location.search);
  const success = search.get('success');
  const message = search.get('message');
  const email = search.get('email');

  let title: string = 'User Profile';
  const showForm: boolean =
    success === null ||
    success === 'true' ||
    (success === 'false' && message === 'This URL can be used only once');
  if (!showForm) {
    if (message === messageExpired) {
      title = 'This email confirmation link has expired.';
    } else if (message) {
      title = message;
    } else {
      title = 'Your email address could not be verified.';
    }
  }

  const { data: userProfileData } = useQuery(GET_USER_PROFILE, {
    skip: !userEmail,
    errorPolicy: 'ignore',
    variables: { email: userEmail },
  });

  const [updateUserByEmail] = useMutation(UPDATE_USER_BY_EMAIL, {
    errorPolicy: 'ignore',
  });

  const [updatePartyById] = useMutation(UPDATE_PARTY_BY_ID, {
    errorPolicy: 'ignore',
  });

  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [initialFieldValues, setInitialFieldValues] = useState<UserProfileValues | undefined>();

  useEffect(() => {
    if (!userProfileData?.userByEmail) return;
    const { roleTitle, phoneNumber, partyByPartyId } = userProfileData.userByEmail;
    const { image, description, name } = partyByPartyId;
    setInitialFieldValues({
      name: name || '',
      roleTitle: roleTitle || '',
      description: description?.trim() || '',
      phone: phoneNumber || '',
      photo: image || '',
    });
  }, [userProfileData]);

  const resendEmail = useCallback(() => {
    setSubmitting(true);
    axios
      .post(`${getApiUri()}/auth/verification-email`, {
        email,
      })
      .then(resp => {
        setSubmitting(false);
        setStatus('Email resent! Please check your inbox.');
        setError(null);
      })
      .catch(err => {
        setSubmitting(false);
        setError(err);
        setStatus(null);
      });
  }, [email]);

  async function submitUserProfile(values: UserProfileValues): Promise<void> {
    try {
      const { data: userData } = await updateUserByEmail({
        variables: {
          input: {
            email: userEmail,
            userPatch: {
              phoneNumber: values.phone,
              roleTitle: values.roleTitle,
            },
          },
        },
      });
      const { partyId } = userData.updateUserByEmail.user;
      await updatePartyById({
        variables: {
          input: {
            id: partyId,
            partyPatch: {
              description: values.description,
              name: values.name,
              image: values.photo,
            },
          },
        },
      });
    } catch (e) {
      setError(e);
    } finally {
      setSubmitting(false);
    }
  }

  const classes = useStyles();
  return (
    <OnBoardingSection formContainer title={title}>
      {success === 'true' && <Banner text="Email address confirmed!" />}
      {success === 'false' && message === messageExpired && (
        <>
          <OnBoardingCard>
            <Description className={classes.resend}>
              <Link onClick={resendEmail}>Resend</Link> confirmation email.
            </Description>
          </OnBoardingCard>
          {!isSubmitting && error && <ErrorBanner text={error.toString()} />}
          {!isSubmitting && status && <Banner text={status} />}
        </>
      )}
      {showForm && <UserProfileForm submit={submitUserProfile} initialValues={initialFieldValues} />}
    </OnBoardingSection>
  );
}