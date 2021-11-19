/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core-components';
import { NewRelicDashboardApiRef } from '../../../api';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';

type Props = {
  guid: String;
  name: String;
  permalink: string;
  duration: Number;
};

export const DashboardSnapshot = ({
  guid,
  name,
  permalink,
  duration,
}: Props) => {
  const NewRelicDashboardAPI = useApi(NewRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const dashboardObject: any = NewRelicDashboardAPI.getDashboardSnapshot(
      guid,
      duration,
    );
    return dashboardObject;
  }, []);
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Paper>
      <Grid style={{ width: '100%' }} container spacing={3} direction="column">
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <Link target="_blank" href={permalink}>
            <Typography variant="h4">{name}</Typography>
          </Link>
        </Grid>

        <Grid item xs={12}>
          <a target="_blank" href={permalink}>
            <img
              alt={`${name} Dashbord`}
              style={{ border: 'solid 1px black' }}
              src={`?${value?.getDashboardSnapshot?.data?.dashboardCreateSnapshotUrl?.replace(
                /...$/,
                'png',
              )}`}
            />
          </a>
          {/* {JSON.stringify(
          value.getDashboardSnapshot.data.dashboardCreateSnapshotUrl.replace(
            /...$/,
            'png',
          ),
        )} */}
        </Grid>
      </Grid>
    </Paper>
  );
};
