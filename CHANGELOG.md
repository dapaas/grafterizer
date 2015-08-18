### 0.2.0

#### Features

 * The JavaScript errors are reported with Raven-js to a Sentry server hosted on AWS.
 * The transformation layout can be resized.
 * The RDF mapping contains beautiful icons.
 * It's possible to remove a graph mapping from a transformation.
 * The preview mode has been improved in order to facilitate his usage.
 * The preview is paginated, with an infinite scrolling.
 * The data transfer during a datapage creation is now done server side
 * An upload button has been introduced.
 * It is possible to replace an existing custom function

#### Bug Fixes

 * The flexbox layout model has changed in recent browsers releases, and Grafterizer has been fixed.
 * An empty rename-columns function no longer break the preview.
 * The tabular data is correctly transfered to the datapage.
 * Selecting text in the tabs no longer sweep the tabs.
 * The height of modal windows is fixed on small screens.
 * The default RDF mapping is removed.
 * The preview table doesn't change the names of the columns.
 * The help button is hidden when the help link is already displayed by datagraft.net
 * Nginx is now case insensitive, in order to reduce the 404 errors during deployment.

