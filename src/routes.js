import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const GetList = React.lazy(() => import('./views/dashboard/Getlist'))
const AddCollection = React.lazy(() => import('./views/collection/add'))
const DeleteCollection = React.lazy(() => import('./views/collection/delete'))
const UpdateCollection = React.lazy(() => import('./views/collection/update'))
const AddRelation = React.lazy(() => import('./views/relation/add'))
const DeleteRelation = React.lazy(() => import('./views/relation/delete'))
const EmailNotification = React.lazy(() => import('./views/notification/email_notification'))
const MobileNotification = React.lazy(() => import('./views/notification/mobile_notification'))
const DBJobMail = React.lazy(() => import('./views/jobs/DBJobMail'))
const DBJobMobileNotification = React.lazy(() => import('./views/jobs/DBJobMobileNotification'))
const DBJob = React.lazy(() => import('./views/jobs/DBJob'))
const Analytics = React.lazy(() => import('./views/analytics/analytic'))
const Recommendation = React.lazy(() => import('./views/recommendation/createAndRelateNewNodes'))
const CreateNewNodes = React.lazy(() => import('./views/recommendation/createNewNodes'))
const DeleteNodes = React.lazy(() => import('./views/recommendation/deleteNodes'))
const DeleteRelationship = React.lazy(() => import('./views/recommendation/deleteRelationship'))
const DepthRecommendation = React.lazy(() => import('./views/recommendation/depthRecommendation'))
const ShortestPath = React.lazy(() => import('./views/recommendation/shortestPath'))
const QueryBuilder = React.lazy(() => import('./views/query/queryBuilder'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/upload', name: 'Upload', component: Dashboard },
  { path: '/getlist', name: 'GetList', component: GetList },
  { path: '/collection', name: 'Collection', component: AddCollection, exact: true },
  { path: '/relation', name: 'Relation', component: AddRelation, exact: true },
  { path: '/collection/add', name: 'Add', component: AddCollection },
  { path: '/collection/delete', name: 'Delete', component: DeleteCollection },
  { path: '/collection/update', name: 'Update', component: UpdateCollection },
  { path: '/relation/add', name: 'Add', component: AddRelation },
  { path: '/relation/delete', name: 'Delete', component: DeleteRelation },
  { path: '/notification', name: 'Notification', component: EmailNotification, exact: true },
  { path: '/notification/email', name: 'Email', component: EmailNotification },
  { path: '/notification/mobile', name: 'Mobile', component: MobileNotification },
  { path: '/jobs', name: 'Jobs', component: DBJobMail, exact: true },
  { path: '/jobs/dbmail', name: 'DB Job With E-mail Result', component: DBJobMail },
  { path: '/jobs/dbnotification', name: 'DB Job With Notification Result', component: DBJobMobileNotification },
  { path: '/jobs/db', name: 'DB Job', component: DBJob },
  { path: '/analytics', name: 'Analytics', component: Analytics, exact: true },
  { path: '/analytics/analytic', name: 'Analytics', component: Analytics },
  { path: '/recommendation', name: 'Recommendation', component: Recommendation, exact: true },
  { path: '/recommendation/relate_new_nodes', name: 'Relate New Nodes', component: Recommendation },
  { path: '/recommendation/create_new_nodes', name: 'Create New Nodes', component: CreateNewNodes },
  { path: '/recommendation/delete_nodes', name: 'Delete Nodes', component: DeleteNodes },
  { path: '/recommendation/delete_relationship', name: 'Delete Relationship', component: DeleteRelationship },
  { path: '/recommendation/depth', name: 'Depth Recommendation', component: DepthRecommendation },
  { path: '/recommendation/shortest', name: 'Shortest Path', component: ShortestPath },
  { path: '/query', name: 'QueryBuilder', component: QueryBuilder, exact: true },
  { path: '/query/builder', name: 'Query Builder', component: QueryBuilder },
]

export default routes
