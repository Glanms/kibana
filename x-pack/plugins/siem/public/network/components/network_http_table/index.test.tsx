/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { shallow } from 'enzyme';
import { getOr } from 'lodash/fp';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider as ReduxStoreProvider } from 'react-redux';

import {
  apolloClientObservable,
  mockGlobalState,
  TestProviders,
  SUB_PLUGINS_REDUCER,
} from '../../../common/mock';
import { useMountAppended } from '../../../common/utils/use_mount_appended';
import { createStore, State } from '../../../common/store';
import { networkModel } from '../../store';

import { NetworkHttpTable } from '.';
import { mockData } from './mock';

describe('NetworkHttp Table Component', () => {
  const loadPage = jest.fn();
  const state: State = mockGlobalState;

  let store = createStore(state, SUB_PLUGINS_REDUCER, apolloClientObservable);
  const mount = useMountAppended();

  beforeEach(() => {
    store = createStore(state, SUB_PLUGINS_REDUCER, apolloClientObservable);
  });

  describe('rendering', () => {
    test('it renders the default NetworkHttp table', () => {
      const wrapper = shallow(
        <ReduxStoreProvider store={store}>
          <NetworkHttpTable
            data={mockData.NetworkHttp.edges}
            fakeTotalCount={getOr(50, 'fakeTotalCount', mockData.NetworkHttp.pageInfo)}
            id="http"
            isInspect={false}
            loading={false}
            loadPage={loadPage}
            showMorePagesIndicator={getOr(
              false,
              'showMorePagesIndicator',
              mockData.NetworkHttp.pageInfo
            )}
            totalCount={mockData.NetworkHttp.totalCount}
            type={networkModel.NetworkType.page}
          />
        </ReduxStoreProvider>
      );

      expect(wrapper.find('Connect(Component)')).toMatchSnapshot();
    });
  });

  describe('Sorting', () => {
    test('when you click on the column header, you should show the sorting icon', () => {
      const wrapper = mount(
        <MockedProvider>
          <TestProviders store={store}>
            <NetworkHttpTable
              data={mockData.NetworkHttp.edges}
              fakeTotalCount={getOr(50, 'fakeTotalCount', mockData.NetworkHttp.pageInfo)}
              id="http"
              isInspect={false}
              loading={false}
              loadPage={loadPage}
              showMorePagesIndicator={getOr(
                false,
                'showMorePagesIndicator',
                mockData.NetworkHttp.pageInfo
              )}
              totalCount={mockData.NetworkHttp.totalCount}
              type={networkModel.NetworkType.page}
            />
          </TestProviders>
        </MockedProvider>
      );

      expect(store.getState().network.page.queries!.http.sort).toEqual({
        direction: 'desc',
      });

      wrapper.find('.euiTable thead tr th button').first().simulate('click');

      wrapper.update();

      expect(store.getState().network.page.queries!.http.sort).toEqual({
        direction: 'asc',
      });
      expect(wrapper.find('.euiTable thead tr th button').first().find('svg')).toBeTruthy();
    });
  });
});
