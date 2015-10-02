### 0.3.0

#### Features
 * Improved pipeline view
 * Improved RDF mapping view
 * Redesign of the utility functions view
 * Improved RDF vocabulary management
 * Added keyword support in transformations metadata
 * New readonly mode
 * Datapage creation from Grafterizer
 * Integration with datagraft.net
 * Improved previewing service with a cache and a load balancer
 * Integration of jarfter : generation of Java transformation executables
 * the table column names doesn't start by ':'
 * The uploaded files titles don't contain the month
 * Clicking outside a dialog will close the dialog
 * Updated to Angular 1.4 and Angular Material 0.11
 * Browsing of public transformations
 * Search in the transformation view


#### Bug fixes
 * The stability has been improved by 20%
 * It is now possible to upload a file when a new transformation hasn't been saved yet
 * The dataset upload button doesn't hide anymore the preview table
 * Support of transformations taking longer than 30 seconds to process
 * The clojure view desynchronizations should be fixed
 * Fixed layout when the window is resized from a very small size back to a normal size
 * RDF mapping prefixes can be deleted
 * Preview requests are sent more intelligently
 * Fixed Datagraft.net integration with Microsoft Edge and Safari
 * All the root nodes types are available in the RDF mapping
 * It is possible to close the utility functions dialog when no function is selected
 * It is possible to upload CSV when the clojure view is selected
 * Switching the automatic preview on will trigger a preview requests
 * Editing the root RDF node into a blank node doesn't invalidates the graph mapping anymore
 * Editing a root RDF node doesn't delete all the sub nodes
 * It is possible to select and upload files on touch devices


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

