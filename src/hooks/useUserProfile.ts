// src/hooks/useUserProfile.ts
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

interface UserProfile {
  displayName: string;
  jobTitle: string | null;
  department: string | null;
  mail: string;
}

export const useUserProfile = () => {
  const { instance, accounts } = useMsal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accounts[0]) {
        setLoading(false);
        return;
      }

      try {
        // Get access token for Microsoft Graph
        const response = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        });

        // Call Microsoft Graph API
        const graphResponse = await fetch(
          'https://graph.microsoft.com/v1.0/me',
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          },
        );

        const data = await graphResponse.json();

        setProfile({
          displayName: data.displayName || accounts[0].name,
          jobTitle: data.jobTitle || null,
          department: data.department || null,
          mail: data.mail || data.userPrincipalName,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to account info
        setProfile({
          displayName: accounts[0].name || 'User',
          jobTitle: null,
          department: null,
          mail: accounts[0].username,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [instance, accounts]);

  return { profile, loading };
};
