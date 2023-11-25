import React from 'react';
import { timeAgo } from '../../../../utils/k8s-utils';
import { getClusterNameFromClusterId } from '../../../../utils/multi-ctx';
import { SINGLE_VIEW } from '../config';
import { ConnectionChip } from '../../../connections/ConnectionChip';
import { ConditionalTooltip } from '../../../../utils/utils';

export const NamespaceTableConfig = (switchView, meshSyncResources, k8sConfig) => {
  return {
    name: 'Namespace',
    columns: [
      {
        name: 'id',
        label: 'ID',
        options: {
          display: false,
          customBodyRender: (value) => <ConditionalTooltip value={value} maxLength={10} />,
        },
      },
      {
        name: 'metadata.name',
        label: 'Name',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(value, tableMeta) {
            return (
              <>
                <div
                  style={{
                    color: 'inherit',
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                  }}
                  onClick={() => switchView(SINGLE_VIEW, meshSyncResources[tableMeta.rowIndex])}
                >
                  {value}
                </div>
              </>
            );
          },
        },
      },
      {
        name: 'apiVersion',
        label: 'API version',
        options: {
          sort: false,
        },
      },
      {
        name: 'cluster_id',
        label: 'Cluster',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(val) {
            let clusterName = getClusterNameFromClusterId(val, k8sConfig);
            return (
              <>
                <ConnectionChip title={clusterName} iconSrc="/static/img/kubernetes.svg" />
              </>
            );
          },
        },
      },
      {
        name: 'metadata.creationTimestamp',
        label: 'Age',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(value) {
            let time = timeAgo(value);
            return <>{time}</>;
          },
        },
      },
    ],
  };
};
