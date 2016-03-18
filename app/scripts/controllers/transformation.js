'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationCtrl
 * @description
 * # TransformationCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationCtrl', function(
              $scope,
               $stateParams,
               ontotextAPI,
               dataGraftApi,
               uploadFile,
               $rootScope,
               $state,
               $mdToast,
               $mdDialog,
               transformationDataModel,
               generateClojure,
               $controller) {


  var customfunctions = [
    new transformationDataModel.CustomFunctionDeclaration(
      'replace-varible-string',
      '(defn replace-varible-string [cell]   (-> cell  (clojure.string/replace (read-string "#\\".* #\\"") "number") (clojure.string/replace (read-string "#\\"[0-9]{4} \\"") "") ))',
      'SERVICE', ''),
    new transformationDataModel.CustomFunctionDeclaration(
      'organize-date',
      '(defn organize-date "Transform date dd/mm/yyyy ~> yyyy-mm-dd" [date] (when (seq date)  (let [[d m y] (clojure.string/split date  (read-string "#\\"/\\""))]  (apply str (interpose "-" [y m d])))))',
      'DATE FUNCTIONS', 'Transform date dd/mm/yyyy ~> yyyy-mm-dd'),
    new transformationDataModel.CustomFunctionDeclaration(
      'double-literal',
      '(defn double-literal [s] (if (nil? (re-matches #"[0-9.]+" s)) 0 (Double/parseDouble s)))', 
      'CONVERT DATATYPE', 'Coerce to double. Null and non-valid values are replaced with zero'),
    new transformationDataModel.CustomFunctionDeclaration(
      'integer-literal',
      '(defn integer-literal [s] (if (nil? (re-matches #"[0-9.]+" s)) 0 (Integer/parseInt s)))', 
      'CONVERT DATATYPE', 'Coerce to integer. Null and non-valid values are replaced with zero'),
    new transformationDataModel.CustomFunctionDeclaration(
      'transform-gender',
      '(def transform-gender {"f" (s "female") "m" (s "male")})', 'UTILITY',
      'Maps "f" to "female" and "m" to "male"'),
    new transformationDataModel.CustomFunctionDeclaration(
      'stringToNumeric',
      '(defn stringToNumeric    [x] (if (= "" x) nil  (if (.contains x ".") (Double/parseDouble x)(Integer/parseInt x))))',
      'CONVERT DATATYPE', 'Convert string to numeric'),
    new transformationDataModel.CustomFunctionDeclaration(
      'string-literal', 
      '(def string-literal s)',
      'CONVERT DATATYPE', 'Coerce to string'),
    new transformationDataModel.CustomFunctionDeclaration('boolean', '', 'CONVERT DATATYPE', 'Coerce to boolean'),
    new transformationDataModel.CustomFunctionDeclaration('count', '', 'COLLECTION', 'Returns the number of items in the collection'),
    new transformationDataModel.CustomFunctionDeclaration('cast', '', 'CONVERT DATATYPE', ' Throws a ClassCastException if x is not a c, else returns x'),
    new transformationDataModel.CustomFunctionDeclaration('capitalize', '', 'STRING', 'Converts first character of the string to upper-case, all other characters to lower-case.'),
    new transformationDataModel.CustomFunctionDeclaration('dec', '', 'NUMBER', 'Returns a number one less than num'),
    new transformationDataModel.CustomFunctionDeclaration('double', '', 'CONVERT DATATYPE', 'Coerce to double'),
    new transformationDataModel.CustomFunctionDeclaration('first', '', 'COLLECTION', 'Returns the first item in the collection'),
    new transformationDataModel.CustomFunctionDeclaration('float', '', 'CONVERT DATATYPE', 'Coerce to float'),
    new transformationDataModel.CustomFunctionDeclaration('inc', '', 'NUMBER', 'Returns a number one greater than num'),
    new transformationDataModel.CustomFunctionDeclaration('keyword', '', 'CONVERT DATATYPE', 'Returns a Keyword with the given namespace and name. '),
    new transformationDataModel.CustomFunctionDeclaration('last', '', 'COLLECTION', 'Return the last item in the collection'),
    new transformationDataModel.CustomFunctionDeclaration('long', '', 'CONVERT DATATYPE', 'Coerce to long'),
    new transformationDataModel.CustomFunctionDeclaration('name', '', 'CONVERT DATATYPE', 'Returns the name String of a string, symbol or keyword'),
    new transformationDataModel.CustomFunctionDeclaration('second', '', 'COLLECTION', 'Returns the second item in the collection'),
    new transformationDataModel.CustomFunctionDeclaration('short', '', 'CONVERT DATATYPE', 'Coerce to short'),
    new transformationDataModel.CustomFunctionDeclaration(
      'join',        
      '(defn join [& strings] (clojure.string/join " " strings))', 
      'STRING', 'Returns a string of all elements in the collection separated by space.'),
    new transformationDataModel.CustomFunctionDeclaration(
      'join-with',
      '(defn join-with [sep] ( fn [& strings] (clojure.string/join sep strings)))', 
      'STRING', 'Returns a string of all elements in the collection separated by custom separator.'),
    new transformationDataModel.CustomFunctionDeclaration('lower-case', '', 'STRING', 'Converts string to all lower-case'),
    new transformationDataModel.CustomFunctionDeclaration('upper-case', '', 'STRING', 'Converts string to all upper-case'),
    new transformationDataModel.CustomFunctionDeclaration('reverse', '', 'STRING', 'Returns given string with its characters reversed'),
    new transformationDataModel.CustomFunctionDeclaration(
      'string-as-keyword', 
      '(defn string-as-keyword [s] ( when (seq s) (->   (str s) clojure.string/trim   (clojure.string/replace "(" "-") (clojure.string/replace ")" "") (clojure.string/replace " " "_") (clojure.string/replace "," "-") (clojure.string/replace "." "") (clojure.string/replace "/" "-") (clojure.string/replace "---" "-") (clojure.string/replace "--" "-") (clojure.string/replace ":" "") (clojure.string/replace "\\"" "") )))', 'STRING', 'Removes blanks and special symbols from a string thus making it possible to use it as a keyword'),
    new transformationDataModel.CustomFunctionDeclaration('remove-blanks', '(defn remove-blanks [s]  (when (seq s)  (clojure.string/replace s " " "")))', 'STRING', 'Removes blanks in a string'),
    new transformationDataModel.CustomFunctionDeclaration('titleize', '(defn titleize [st] (when (seq st) (let [a (clojure.string/split st (read-string "#\\" \\"")) c (map clojure.string/capitalize a)]  (->> c (interpose " ") (apply str) clojure.string/trim))))', 'STRING', 'Capitalizes each word in a string'),
    new transformationDataModel.CustomFunctionDeclaration('trim', '', 'STRING', 'Removes whitespace from both ends of string'),
    new transformationDataModel.CustomFunctionDeclaration('trim-newline',
                                                          '', 'STRING', 'Removes all trailing newline \n or return \r characters from string'),
    new transformationDataModel.CustomFunctionDeclaration('triml', '', 'STRING',
                                                          'Removes whitespace from the left side of string'),
    new transformationDataModel.CustomFunctionDeclaration('trimr', '', 'STRING',
                                                          'Removes whitespace from the right side of string'),
    new transformationDataModel.CustomFunctionDeclaration('str', '', 'STRING',
                                                          'With one arg x, returns x.toString(). (str nil) returns the empty string. With more than one arg, returns the concatenation of the str values of the args.'),
    new transformationDataModel.CustomFunctionDeclaration('rem', '', 'NUMBER',
                                                          'Returns remainder of dividing numerator by denominator')];
  customfunctions.sort(function(a, b) {
    if (a.name > b.name) {
      return 1;

    } else {
      return -1;
    }

  });

  customfunctions.push(
    new transformationDataModel.CustomFunctionDeclaration(
      'get-lat-long-strings-replacement', 
      '(defn get-lat-long-strings-replacement [easting northing hemisphere zoneNumber] (let [utmCoords (. gov.nasa.worldwind.geom.coords.UTMCoord fromUTM (Integer/parseInt zoneNumber) (if (= hemisphere "N") "gov.nasa.worldwind.avkey.North" (if (= hemisphere "S") "gov.nasa.worldwind.avkey.East" (throw (Exception. "Wrong hemisphere input")))) (Double/parseDouble easting) (Double/parseDouble northing))] (vector (re-pattern easting) (str (.getDegrees (.getLongitude utmCoords))) (re-pattern northing) (str (.getDegrees (.getLatitude utmCoords))))))', 
      'SERVICE', 
      'Produces a pair of replacement coordinates for the given easting, northing, hemisphere letter and zone number'),

    new transformationDataModel.CustomFunctionDeclaration(
      'replace-several', 
      '(defn replace-several [content replacements] (let [replacement-list (partition 2 replacements)] (reduce (fn [arg1 arg2] (apply clojure.string/replace arg1 arg2)) content replacement-list)))', 
      'SERVICE',
      'Replace several strings in another string based on a map of replacement pairs (used with "get-lat-long-strings-replacement" results to convert coordinates)'),

    new transformationDataModel.CustomFunctionDeclaration(
      'convert-col-lat-long', 
      '(defn convert-col-lat-long [col hemisphere zoneNumber] (let [all-coords (re-seq (re-pattern "-?[0-9]{1,13}.[0-9]+") col)] (replace-several col (flatten (map (fn [coord-pair] (get-lat-long-strings-replacement (nth coord-pair 0) (nth coord-pair 1) hemisphere zoneNumber)) (partition 2 all-coords))))))', 
      'SERVICE',
      'Convert coordinate pairs in a given cell by input hemisphere string ("N" or "S") and zone number (e.g., 32)')

  );
  
  var predicatefunctions = [
    new transformationDataModel.CustomFunctionDeclaration('empty?', '', 'PREDICATE', 'Returns true if given collection has no items'),
    new transformationDataModel.CustomFunctionDeclaration('not-empty?', '(def not-empty? (complement empty?))', 'PREDICATE', 'Returns true if given collection has at least 1 item'),
    new transformationDataModel.CustomFunctionDeclaration(
      'every?', '', 'PREDICATE',
      'Returns true if first argument predicate is logical true for every x in collection, else false'), new transformationDataModel
    .CustomFunctionDeclaration(
      'false?', '', 'PREDICATE', 'Returns true if given value is the value false, false otherwise'), new transformationDataModel
    .CustomFunctionDeclaration(
      'float?', '', 'PREDICATE', 'Returns true if given value is a floating point number'), new transformationDataModel
    .CustomFunctionDeclaration(
      'keyword?', '', 'PREDICATE', 'Return true if given argument is a Keyword'), new transformationDataModel.CustomFunctionDeclaration(
      'neg?', '', 'PREDICATE', 'Returns true if argument is less than zero, else false'), new transformationDataModel
    .CustomFunctionDeclaration(
      'nil?', '', 'PREDICATE', 'Returns true if argument is nil, false otherwise'), new transformationDataModel.CustomFunctionDeclaration(
      'number?', '', 'PREDICATE', 'Returns true if argument is a Number'), new transformationDataModel.CustomFunctionDeclaration(
      'odd?', '', 'PREDICATE', 'Returns true if argument is odd, throws an exception if it is not an integer'), new transformationDataModel
    .CustomFunctionDeclaration(
      'pos?', '', 'PREDICATE', 'Returns true if argument is greater than zero, else false'), new transformationDataModel
    .CustomFunctionDeclaration(
      'ratio?', '', 'PREDICATE', 'Returns true if argument is a Ratio'), new transformationDataModel.CustomFunctionDeclaration(
      'rational?', '', 'PREDICATE', 'Returns true if argument is a rational number'), new transformationDataModel.CustomFunctionDeclaration(
      'string?', '', 'PREDICATE', 'Return true if argument is a String'), new transformationDataModel.CustomFunctionDeclaration(
      'true?', '', 'PREDICATE', 'Returns true if argument is the value true, false otherwise'), new transformationDataModel
    .CustomFunctionDeclaration(
      'zero?', '', 'PREDICATE', 'Returns true if argument is zero, else false')];

  var numericcustomfunctions = [new transformationDataModel.CustomFunctionDeclaration(
    '+', '', 'NUMBER', ''),
                                new transformationDataModel.CustomFunctionDeclaration(
                                  '-', '', 'NUMBER', ''),
                                new transformationDataModel.CustomFunctionDeclaration(
                                  '*', '', 'NUMBER', ''),
                                new transformationDataModel.CustomFunctionDeclaration(
                                  '/', '', 'NUMBER', '')];

  var servicefunctions = [
    new transformationDataModel.CustomFunctionDeclaration('get-comparator', '(defn get-comparator [sorttype]' +
                                                          ' (let [f (cond' +
                                                          '(= sorttype :ascalpha)       (fn [a b] (compare (str a) (str b))) ' +
                                                          '(= sorttype :descalpha)      (fn [a b] (compare (str b) (str a))) ' +
                                                          '(= sorttype :ascnum)         (fn [a b] (<  (Double/parseDouble (str a))  (Double/parseDouble (str b)))) ' +
                                                          '(= sorttype :descnum)        (fn [a b] (<  (Double/parseDouble (str b))  (Double/parseDouble (str a)))) ' +
                                                          '(= sorttype :asclen)         (fn [a b] (<  (count (str a))  (count (str b)))) ' +
                                                          '(= sorttype :desclen)        (fn [a b] (<  (count (str b))  (count (str a)))) ' +
                                                          '(= sorttype :ascdate)        (fn [a b] (compare (.parse (java.text.SimpleDateFormat. "dd.MM.yyyy") (str a)) ' +
                                                          '(.parse (java.text.SimpleDateFormat. "dd.MM.yyyy") (str b)))) ' +
                                                          '(= sorttype :descdate)       (fn [a b] (compare (.parse (java.text.SimpleDateFormat. "dd.MM.yyyy") (str b)) ' +
                                                          '(.parse (java.text.SimpleDateFormat. "dd.MM.yyyy") (str a)))) ' +
                                                          ':else ' +
                                                          ' (fn [a b] (compare a b)))]' +
                                                          'f ))', 'SERVICE', 'Used by sort-dataset'),
    new transformationDataModel.CustomFunctionDeclaration('sort-dataset', '(defn sort-dataset' +
                                                          ' [dataset colnames-sorttypes]' +
                                                          '(-> (make-dataset' +
                                                          '(sort  (fn [a b] (loop [cs colnames-sorttypes] ' +
                                                          '(let [current (first cs) ' +
                                                          'f (get-comparator (val (first current))) ' +
                                                          'col (key (first current))] ' +
                                                          '(if  (or (= (count cs) 1) ' +
                                                          '(not= ' +
                                                          '(f (col a) (col b)) ' +
                                                          '(f (col b) (col a)))) ' +
                                                          '(f (col a) (col b)) ' +
                                                          '(recur (rest cs) ))))) ' +
                                                          '(:rows dataset)) ' +
                                                          ' (column-names dataset)) (with-meta (meta dataset))))', 'SERVICE', 'Sorts a dataset by given column(s) in given order'),
    new transformationDataModel.CustomFunctionDeclaration('MIN', '(defn MIN [& args] (apply min (map (fn [arg] ( Double/parseDouble (str arg))) args)))', 'SERVICE',
                                                          'Aggregation function for use with group-rows'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('MAX', '(defn MAX [& args] (apply max (map (fn [arg] ( Double/parseDouble (str arg))) args)))', 'SERVICE',
                                                          'Aggregation function for use with group-rows'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('SUM', '(defn SUM [& args] (apply + (map (fn [arg] (Double/parseDouble (str arg))) args)))', 'SERVICE',
                                                          'Aggregation function for use with group-rows'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('COUNT', '(defn COUNT [& args] (count (into [] args)))', 'SERVICE',
                                                          'Aggregation function for use with group-rows'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('AVG', '(defn AVG [& args] (/ (apply SUM args) (apply COUNT args)))', 'SERVICE',
                                                          'Aggregation function for use with group-rows'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('group-rows', '(defn group-rows [dataset colnames colnames-functions]' +
                                                          '(let [ds-rows (:rows dataset) ' +
                                                          'grouped-rows   (for [m (group-by (fn [k] (select-keys k colnames)) ds-rows)] ' +
                                                          '(into {} (for [groupvar (key m)] ' +
                                                          '(assoc (into {} (for [keyval colnames-functions] ' +
                                                          '(let [newcolname  (keyword (str (name (key (first keyval))) "_" ( case (str (first (re-find (read-string "#\\"(?<=\\\\\\\\$)(.*?)(?=\\\\\\\\@)\\"") (str (val (first keyval)))))) ' +
                                                          '("MAX" "MIN" "SUM" "AVG" "COUNT") ' +
                                                          '(first (re-find (read-string "#\\"(?<=\\\\\\\\$)(.*?)(?=\\\\\\\\@)\\"") (str (val (first keyval))))) ' +
                                                          '"MERGED") ' + 
                                                          ' ))]' +
                                                          '(if (and (re-find (read-string "#\\"COUNT+\\"") (str (val (first keyval))) ) ' +
                                                          ' (= (count  (map (fn [k] (hash-map newcolname (get [k] (key (first keyval))))) (val m))) 1)) ' +
                                                          ' (hash-map newcolname 1) ' +
                                                          ' (case  (str (first (re-find (read-string "#\\"(?<=\\\\\\\\$)(.*?)(?=\\\\\\\\@)\\"") (str (val (first keyval)))))) ' + 
                                                          ' ("MAX" "MIN" "SUM" "AVG" "COUNT" ) ' +   
                                                          ' (apply merge-with  (val (first keyval)) ' +
                                                          '(map (fn [k] (hash-map newcolname (get k (key (first keyval))))) (val m)))' +
                                                          ' (apply merge-with  (fn [& args] (clojure.string/join (str (val (first keyval))) (distinct (into [] args)))) ' +
                                                          '(map (fn [k] (hash-map newcolname (get k (key (first keyval))))) (val m)))' +

                                                          '))))) ' +
                                                          ' (key groupvar) (val groupvar))))) ' +
                                                          'new-colnames (concat colnames (for [keyval colnames-functions] (keyword (str (name (key (first keyval))) "_" (case (first (re-find (read-string "#\\"(?<=\\\\\\\\$)(.*?)(?=\\\\\\\\@)\\"") (str (val (first keyval))))) ' +
                                                          '("MAX" "MIN" "SUM" "AVG" "COUNT") ' +
                                                          '(first (re-find (read-string "#\\"(?<=\\\\\\\\$)(.*?)(?=\\\\\\\\@)\\"") (str (val (first keyval))))) ' +
                                                          '"MERGED") ' + 
                                                          '))))]' +
                                                          '(-> (make-dataset grouped-rows new-colnames)(with-meta (meta dataset)))))'

                                                          , 'SERVICE',
                                                          'Groups rows in a dataset'
                                                         ),

    new transformationDataModel.CustomFunctionDeclaration('split-column',
                                                          '(defn split-column [dataset colname separator]' +
                                                          '   (let [ col-pos (.indexOf (column-names dataset) colname) ' +
                                                          '[colon & columnname] (str colname) ' +
                                                          'new-rows   (->> dataset ' +
                                                          ':rows ' +
                                                          '(map (fn [row] ' +
                                                          '(let [value-in-row (get row colname) ' +
                                                          'new-col-vals (clojure.string/split value-in-row separator) ' +
                                                          'index-last (- (count new-col-vals) 1)] ' +
                                                          '(loop [i 0 rowmap row] ' +
                                                          '(if (> i index-last) ' +
                                                          'rowmap ' +
                                                          '(recur (inc i) ' +
                                                          '(assoc rowmap (keyword (str (apply str columnname) "_splitted_" (str i)))  (get new-col-vals i))))))))) ' +
                                                          'new-columns   (set (apply concat (->> dataset ' +
                                                          ':rows ' +
                                                          '(map (fn [row] ' +
                                                          '(let [value-in-row (get row colname) ' +
                                                          'new-col-vals (clojure.string/split value-in-row separator) ' +
                                                          'index-last (- (count new-col-vals) 1)] ' +
                                                          '(loop [i 0 newcols #{}] ' +
                                                          '(if (> i index-last) ' +
                                                          'newcols ' +
                                                          '(recur (inc i)(conj newcols (keyword (str (apply str columnname) "_splitted_" (str i))) ))))))))))] ' +
                                                          '( -> (make-dataset new-rows ' +
                                                          '(concat (subvec (column-names dataset) 0 col-pos) (sort new-columns)(subvec (column-names dataset) (+ col-pos 1)))) ' +
                                                          ' (with-meta (meta dataset)))))', 'SERVICE',
                                                          'Splits a column based on the specified separator'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('fill-when', '(defn fill-when [col] (grafter.sequences/fill-when col))', 'SERVICE',
                                                          'Takes a sequence of values and copies a value through the sequence depending on the supplied predicate function'
                                                         ),
    new transformationDataModel.CustomFunctionDeclaration('add-filename-to-column',
                                                          '(defn add-filename-to-column [ds destination-column] (let [fname (:grafter.tabular/data-source (meta ds))] (add-column ds destination-column fname)))     ',
                                                          'SERVICE', ''),
    new transformationDataModel.CustomFunctionDeclaration('shift-column',
                                                          '(defn shift-column  ([dataset column] (let [data (:rows dataset) header (column-names dataset) colname (if (keyword? column) column (get (column-names dataset) column))]  (-> (make-dataset data (conj (into [] (remove #{colname} header )) colname))  (with-meta (meta dataset))))) ([dataset column position-to]  (let [data (:rows dataset)  header (column-names dataset)   colname (if (keyword? column) column (get (column-names dataset) column))  position-from (.indexOf header colname)  last-pos (- (count header) 1)]  (-> (make-dataset data (into []   (cond (>= position-to last-pos)(shift-column colname)                (< position-from position-to)  (concat (subvec header 0 position-from)  (subvec header (+ position-from 1) (+ position-to 1))   [colname]  (subvec header (+ position-to 1)))                         (>= position-from last-pos) (concat (subvec header 0 position-to) [colname] (subvec header  position-to last-pos))                                    :else ( concat (subvec header 0 position-to) [colname]  (subvec header position-to position-from)  (subvec header (+ position-from 1)))  )  )                           )  (with-meta (meta dataset))))) ) ', 'SERVICE', 'Shift column'),
    /* new transformationDataModel.CustomFunctionDeclaration('merge-columns',
        '(defn merge-columns   ([dataset columns separator] (let [pos (.indexOf (column-names dataset) (nth columns 0))  [colon & colname] (str (nth columns 0))   tempname (keyword (str (apply str colname) "_merged_temp"))]    (-> (derive-column dataset tempname columns (fn [& strings] (clojure.string/join separator strings))) (shift-column tempname pos)  (remove-columns columns) (rename-columns {tempname (keyword (str (apply str colname)))}))  ))  ([dataset columns separator newname] (let [pos (.indexOf (column-names dataset) (nth columns 0))]  (-> (derive-column dataset newname columns (fn [& strings] (clojure.string/join separator strings)))  (shift-column newname pos)   (remove-columns columns))    ))  )', 'SERVICE', 'Merges several columns in one'),
*/
    new transformationDataModel.CustomFunctionDeclaration('remove-columns',
                                                          '(defn remove-columns  ([dataset cols] (columns dataset (remove (fn [item] (some (fn [a] (= item a)) cols)) (column-names dataset)))) ([dataset indexFrom indexTo] (cond (= indexTo (count (column-names dataset)))   (columns dataset (range 0 indexFrom))  :else (columns dataset (concat     (range 0 indexFrom) (range (+ indexTo 1) (count (column-names dataset))))))))', 'SERVICE', 'Removes columns from a dataset'),
    new transformationDataModel.CustomFunctionDeclaration('add-row',
                                                          '(defn add-row  ( [dataset [& values]] (-> (make-dataset (:rows (incanter.core/conj-rows dataset values)) (column-names dataset))(with-meta (meta dataset)))) ( [dataset position [& values]] ( if (or (< position 0) (>= position (count (:rows dataset)))) (add-row dataset [values])  (-> (make-dataset (:rows (incanter.core/conj-rows (take-rows dataset position ) values (rows dataset (range position (count (:rows dataset)))) )) (column-names dataset)) (with-meta (meta dataset))  ))) )', 'SERVICE', 'Adds new row to a dataset'),
    new transformationDataModel.CustomFunctionDeclaration('remove-duplicates',
                                                          '(defn remove-duplicates' +
                                                          '([dataset] (-> (make-dataset (distinct (:rows dataset)) (column-names dataset)) (with-meta (meta dataset))))' +
                                                          '([dataset colnames]' +
                                                          '(let [ ds-rows (:rows dataset)' +
                                                          'grouped-rows   (for [m (group-by (fn [k] (select-keys k colnames)) ds-rows)]'    +
                                                          '(into {} (for [groupvar (key m)]' +
                                                          '(assoc (apply merge-with (fn [& args] (first (into [] args)))' +
                                                          '(map (fn [k] (dissoc k (key groupvar))) (val m)))'        +
                                                          '(key groupvar) (val groupvar)))))]' +
                                                          ' (-> (make-dataset grouped-rows (column-names dataset)) (with-meta (meta dataset)))))' +
                                                          ')', 
                                                          'SERVICE', 'Removes duplicates from a dataset'),
    new transformationDataModel.CustomFunctionDeclaration('shift-row',
                                                          '(defn shift-row' +
                                                          '( [dataset position-from]' +
                                                          '( -> (make-dataset (:rows (incanter.core/conj-rows (take-rows dataset position-from)' +
                                                          '(rows dataset (range (+ position-from 1) (count (:rows dataset))))' +
                                                          '(rows dataset [position-from])))' +
                                                          '(column-names dataset))' +
                                                          '(with-meta (meta dataset))))' +
                                                          '( [dataset position-from position-to]' +
                                                          ' (let [f (+ position-from 1)' +
                                                          't (+ position-to 1)' +
                                                          'eods (count (:rows dataset)) ]' +
                                                          '(-> (make-dataset (cond (< position-from position-to) (:rows (incanter.core/conj-rows (take-rows dataset position-from)' +
                                                          '(rows dataset (range f t))' +
                                                          '(rows dataset [position-from])' +   
                                                          '(rows dataset (range t eods))))' +
                                                          ':else (:rows (incanter.core/conj-rows (take-rows dataset position-to)' +
                                                          '(rows dataset [position-from])' +
                                                          '(rows dataset (range position-to position-from))' +
                                                          '(rows dataset (range f eods)))))' +
                                                          '(column-names dataset))' +
                                                          '(with-meta (meta dataset))))))', 'SERVICE', 'Shifts row in a dataset'),
    new transformationDataModel.CustomFunctionDeclaration(
      'is-numeric',
      '(defn is-numeric [x] (not (nil? (re-matches #"[0-9.-]+" (str x)))))',
      'SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration('true-value',
                                                          '(defn true-value? [x]  (if (or (= (clojure.string/trim (clojure.string/lower-case (str x))) "false")  (and (re-matches #"[0-9.]+" (str x)) (= (str x) "0")) ) false true))','SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration('check-datatype',
                                                          '(defn check-datatype [dtype a]  (case dtype ' +
                                                          '"byte"  (and  (is-numeric a) (< (Double/parseDouble (str a)) 128) (> (Double/parseDouble (str a)) -129)) ' +
                                                          '"short" (and  (is-numeric a) (< (Double/parseDouble (str a)) 32768) (> (Double/parseDouble (str a)) -32769)) ' +
                                                          '"double" (is-numeric a) ' +
                                                          '"decimal" (is-numeric a) ' +
                                                          '"integer" (and (not (nil? (re-matches #"[0-9-]+" (str a)))) (< (Long/parseLong (str a)) (Long/parseLong "2147483648")) (> (Long/parseLong (str a)) (Long/parseLong "-2147483649"))) ' +
                                                          '"long" (and (not (nil? (re-matches #"[0-9-]+" (str a)))) (< (Double/parseDouble (str a)) (Long/parseLong "9223372036854775808")) (> (Long/parseLong (str a)) (Long/parseLong "-9223372036854775809"))) ' +
                                                          '"float" (is-numeric a) ' +
                                                          'nil))' ,
                                                          'SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration('parce-date-eu','(defn parse-date-eu [d] (.toDate (clj-time.format/parse (clj-time.format/formatter (clj-time.core/default-time-zone) "dd/MM/yyyy"   "dd-MM-yyyy" "dd.MM.yyyy" ) d)))',
                                                          'SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration('parce-date-us','(defn parse-date-us [d] (.toDate (clj-time.format/parse (clj-time.format/formatter (clj-time.core/default-time-zone) "MM/dd/yyyy"   "MM-dd-yyyy" "MM.dd.yyyy" "yyyy-MM-dd" "yyyy.MM.dd" "yyyy/MM/dd") d)))',
                                                          'SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration('date-validator','(defn date-validator [d] ( if (re-matches #"(?:(?:31(\\\\\\\\/|-|\\\\\\\\.)(?:0?[13578]|1[02]))\\\\\\\\1|(?:(?:29|30)(\\\\\\\\/|-|\\\\\\\\.)(?:0?[1,3-9]|1[0-2])\\\\\\\\2))(?:(?:1[6-9]|[2-9]\\\\\\\\d)?\\\\\\\\d{2})$|^(?:29(\\\\\\\\/|-|\\\\\\\\.)0?2\\\\\\\\3(?:(?:(?:1[6-9]|[2-9]\\\\\\\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\\\\\\\d|2[0-8])(\\\\\\\\/|-|\\\\\\\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\\\\\\\4(?:(?:1[6-9]|[2-9]\\\\\\\\d)?\\\\\\\\d{2})$" d) "eu" ' +
                                                          ' (if (re-matches #"(?:(?:(?:0?[13578]|1[02])(\\\\\\\\/|-|\\\\\\\\.)31)\\\\\\\\1|(?:(?:0?[1,3-9]|1[0-2])(\\\\\\\\/|-|\\\\\\\\.)(?:29|30)\\\\\\\\2))(?:(?:1[6-9]|[2-9]\\\\\\\\d)?\\\\\\\\d{2})$|^(?:0?2(\\\\\\\\/|-|\\\\\\\\.)29\\\\\\\\3(?:(?:(?:1[6-9]|[2-9]\\\\\\\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\\\\\\\\/|-|\\\\\\\\.)(?:0?[1-9]|1\\\\\\\\d|2[0-8])\\\\\\\\4(?:(?:1[6-9]|[2-9]\\\\\\\\d)?\\\\\\\\d{2})$" d) "us" ' +
                                                          ' (if (re-matches #"(19|20)\\\\\\\\d\\\\\\\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$" d) "us" nil))))',
                                                          'SERVICE', 'Used by convert-literal'),
    new transformationDataModel.CustomFunctionDeclaration(
      'convert-numeric-literal',
      '(defn convert-numeric-literal [arg dtype on-empty on-error] ' +
      '(let[f (case dtype ' +
      '"byte" (fn [a](byte a)) ' +
      '"short" (fn [a](short a)) ' +
      '"double" (fn [a](double a)) ' +
      '"decimal" (fn [a](bigdec a)) ' +
      '"integer" (fn [a](int a)) ' +
      '"long" (fn [a](long a)) ' +
      '"float" (fn [a](float a)) ' +
      'nil) ' +
      '] ' +
      '(cond (empty? arg) (if (not (check-datatype dtype on-empty)) (f 0) (f (Double/parseDouble (str on-empty))))' +
      '(not (check-datatype dtype arg)) (if (not (check-datatype dtype on-error)) (f 0) (f (Double/parseDouble (str on-error))))' +
      '(not (check-datatype dtype arg)) (if (not (check-datatype dtype on-error)) (f 0) (f (Double/parseDouble (str on-error))))' +
      ':else (f (Double/parseDouble arg))))) ',
      'SERVICE','Used by convert-literal'),

    new transformationDataModel.CustomFunctionDeclaration('convert-literal',
                                                          '(defn convert-literal' +
                                                          '[x dtype  &{:keys [on-empty on-error lang-tag] :or {on-error false on-empty 0 lang-tag nil}}] ' +
                                                          ' (let [ default-date (parse-date-eu "31.12.2099") ' +
                                                          'arg (str x) ' +
                                                          'on-empty-s (if (= on-empty 0) "Unknown" on-empty)] ' +
                                                          '(case dtype ' +
                                                          '("byte" "float" "short" "double" "decimal" "integer" "long") ' +
                                                          '(convert-numeric-literal arg dtype on-empty on-error)' +
                                                          /*  '(not (check-datatype dtype arg)) (f (Double/parseDouble (str on-error)))' +*/
                                                          /*'(cond (or (nil? x) (empty? arg))  (if (nil? (re-matches #"[0-9.]+" (str on-empty))) 0 (f (Double/parseDouble (str on-empty))))' +
                                                                                            '(nil? (re-matches #"[0-9.]+" arg)) (if (nil? (re-matches #"[0-9.]+" (str on-error))) 0 (f (Double/parseDouble on-error))) ' +
                                                                                            ':else (f (Double/parseDouble arg))) ' +*/
                                                          '"boolean" (if (or (nil? x) (empty? (str x))) (true-value? on-empty) (true-value? arg)) ' +
                                                          '"date" (if (or (nil? x) (empty? (str x))) (if (date-validator (str on-empty)) (convert-literal on-empty "date") default-date) ' +
                                                          '(case (date-validator arg) ' +
                                                          '"eu" (parse-date-eu arg) ' +
                                                          '"us" (parse-date-us arg) ' +
                                                          '(if (date-validator (str on-error)) (convert-literal on-error "date") default-date) )) ' +
                                                          ' (if (or (nil? x) (empty? (str x))) (if (nil? lang-tag) (s (str on-empty-s)) (s (str on-empty-s) lang-tag) ) (if (nil? lang-tag) (s x) (s x lang-tag)))))) ', 'CONVERT DATATYPE', 'Coerce argument to specified datatype') 





  ];
  var allcustomfunctions = customfunctions.concat(predicatefunctions.concat(numericcustomfunctions));
  allcustomfunctions = servicefunctions.concat(allcustomfunctions);

  var id = $scope.id = $stateParams.id;
  $scope.document = {
    title: 'transformation loading',
    keywords: []
  };

  $scope.loading = true;
  $rootScope.readonlymode = true;

 // setTimeout(function() {
    ontotextAPI.transformation(id).success(function(data) {
    //dataGraftApi.getTransformation("comeonnn").success(function(data) {
    //dataGraftApi.getTransformation(id).success(function(data) {
      $scope.loading = false;
      $rootScope.readonlymode = $state.is('transformations.readonly');
      $scope.document = data;
      $scope.document.title = data['dct:title'];
      $scope.document.description = data['dct:description'];
      $scope.document.keywords = data['dcat:keyword'];

    if (!$scope.document.keywords ||
        typeof $scope.document.keywords.length === 'undefined') {
      $scope.document.keywords = [];
    } else {
      $scope.document.keywords.sort();
    }
  }).error(function() {
    $rootScope.readonlymode = $state.is('transformations.readonly');
    $state.go('transformations');
  });
  // }, 40)

  // ontotextAPI.getClojure(id).success(function(data){
  //     $scope.clojure = data;
  // });

  var loadEmptyTransformation = function() {
    var pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation([], [], [
      pipeline], []);
    $rootScope.transformation = $scope.transformation;
    $scope.pipeline = pipeline;
  };

  ontotextAPI.getJson(id).success(function(data) {
    var transformation;
    if (data.__type === 'Transformation') {
      transformation = transformationDataModel.Transformation.revive(
        data);
      // TODO: dirty but necessary for now
      var shownUpdateMessage = false;
      angular.forEach(allcustomfunctions, function (expectedCFD) {
        var foundCfd = false;
        angular.forEach(transformation.customFunctionDeclarations, function (cfd) {
          if(cfd.name == expectedCFD.name){
            foundCfd = true;
          }
        });
        if(!foundCfd){
          transformation.addCustomFunctionDeclaration(expectedCFD.name, expectedCFD.clojureCode, expectedCFD.group, expectedCFD.docstring);
          if(!shownUpdateMessage){
            $mdToast.show(
              $mdToast.simple()
              .content('Auto-migrated transformation to latest version of Grafterizer. Please save to apply changes.')
              .position('bottom left')
              .hideDelay(6000)
            );
            shownUpdateMessage = true;
          }
        }
      });


    } else {
      $mdToast.show(
        $mdToast.simple()
        .content('Transformation unfound in the save file')
        .position('bottom left')
        .hideDelay(6000)
      );
      return loadEmptyTransformation();
    }
    $scope.transformation = transformation;
    $rootScope.transformation = $scope.transformation;
    if (transformation.pipelines && transformation.pipelines.length) {
      $scope.pipeline = transformation.pipelines[0];
    } else {
      $scope.pipeline = new transformationDataModel.Pipeline([]);
      transformation.pipelines = [$scope.pipeline];
    }
  }).error(loadEmptyTransformation);

  $scope.$watch('fileUpload', function() {
    if ($scope.fileUpload) {
      if ($rootScope.readonlymode) {
        $mdToast.show(
          $mdToast.simple()
          .content($scope.loading ?
                   'Please wait the transformation loading before uploading files' :
                   'File upload is disabled in readonly mode')
          .position('bottom left')
          .hideDelay(6000)
        );
        delete $scope.fileUpload;
        return;
      }

      var file = $scope.fileUpload;

      uploadFile.upload(file, function(data) {
        $state.go('transformations.transformation.preview', {
          id: $stateParams.id,
          distribution: data['@id']
        });
      });

    }
  });

  $scope.$watch('rejectedFileUpload', function() {
    if ($scope.rejectedFileUpload && $scope.rejectedFileUpload.length) {
      delete $scope.rejectedFileUpload;
      $mdToast.show(
        $mdToast.simple()
        .content('The file is not valid. It should be a CSV file smaller than 10Mio')
        .position('bottom left')
        .hideDelay(6000)
      );
    }
  });

  $rootScope.actions = {
    save: function(noPreviewRequest) {
      var update = angular.copy($scope.document);
      update['dct:title'] = update.title;
      update['dct:description'] = update.description;
      update['dct:modified'] = moment().format('YYYY-MM-DD');
      update['dcat:public'] = $scope.document['dct:public'] ? 'true' :
      'false';

      var transformationType = 'pipe';
      var transformationCommand = 'my-pipe';

      if ($scope.transformation.graphs &&
          $scope.transformation.graphs.length !== 0) {
        transformationType = 'graft';
        transformationCommand = 'my-graft';
      }

      update['dcat:transformationType'] = transformationType;
      update['dcat:transformationCommand'] = transformationCommand;

      delete update.title;
      delete update.description;
      delete update['dct:clojureDataID'];
      delete update['dct:jsonDataID'];
      delete update['dct:publisher'];

      var clojure = generateClojure.fromTransformation($scope.transformation);

      ontotextAPI.updateTransformation(update, clojure, $scope.transformation)
        .success(function() {
        if (!noPreviewRequest) {
          $scope.$broadcast('preview-request');
        }
      });
    },

    delete: function(ev) {
      var confirm = $mdDialog.confirm()
      .title('Do you really want to delete this transformation?')
      .content('It\'s a nice transformation')
      .ariaLabel('Deletion confirmation')
      .ok('Please do it!')
      .cancel('I changed my mind, I like it')
      .targetEvent(ev);

      $mdDialog.show(confirm).then(function() {
        ontotextAPI.deleteTransformation(id).success(function() {
          $state.go('transformations');
          $mdToast.show(
            $mdToast.simple()
            .content('Transformation "' + $scope.document.title +
                     '" deleted')
            .position('bottom left')
            .hideDelay(6000)
          );
        });
      });
    },

    fork: function(ev) {
      var clojure = generateClojure.fromTransformation($scope.transformation);

      var transformationType = 'pipe';
      var transformationCommand = 'my-pipe';

      if ($scope.transformation.graphs &&
          $scope.transformation.graphs.length !== 0) {
        transformationType = 'graft';
        transformationCommand = 'my-graft';
      }

      ontotextAPI.newTransformation({
        '@context': ontotextAPI.getContextDeclaration(),
        '@type': 'dcat:Transformation',
        'dct:title': $scope.document.title + '-fork',
        'dct:description': $scope.document.description,
        'dcat:public': $scope.document['dct:public'] ? 'true' : 'false',
        'dct:modified': moment().format('YYYY-MM-DD'),
        'dcat:keyword': $scope.document.keywords,
        'dcat:transformationType': transformationType,
        'dcat:transformationCommand': transformationCommand
      }, clojure, $scope.transformation)
        .success(function(data) {
        $mdToast.show(
          $mdToast.simple()
          .content('Transformation forked')
          .position('bottom left')
          .hideDelay(6000)
        );
        $state.go('transformations.transformation', {
          id: data['@id']
        });
      });
    },

    download: function(ev) {
      if ($rootScope.actions && $rootScope.actions.save && !$state.is('transformations.readonly')) {
        // Save but without a preview

        $rootScope.actions.save(true);
      }

      $mdDialog.show({
        templateUrl: 'views/computetriples.html',
        controller: 'ComputetriplesCtrl',
        scope: $scope.$new(false),
        clickOutsideToClose: true
      });
    }
  };

  $scope.editPrefixers = function() {
    $scope.originalPrefixers = [];
    angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
    $mdDialog.show({
      templateUrl: 'views/editprefixes.html',
      controller: 'EditprefixersCtrl',
      scope: $scope.$new(false, $scope),
      clickOutsideToClose: true
    }).then(
      function() {},

      function() {
        angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
      });
    };
    
    // This function should open the dialog box and set controller for it.
    // Let's try to use the same controller as we're already in :)
    $scope.defineUtilityFunctions = function() {
      //$scope.originalCustomFunctionDeclarations = [];
      //angular.copy($scope.transformation.customFunctionDeclarations, $scope
      //    .originalCustomFunctionDeclarations);
      $mdDialog.show({
        templateUrl: 'views/utilityfunctiondialog.html',
        controller: 'UtilityFunctionsCtrl',
        scope: $scope.$new(false, $scope),
        clickOutsideToClose: true
      }).then(
        function() {});//,
    };

    $scope.defineCustomFunctions = function() {
      $scope.originalCustomFunctionDeclarations = [];
      angular.copy($scope.transformation.customFunctionDeclarations, $scope
        .originalCustomFunctionDeclarations);
      $mdDialog.show({
        templateUrl: 'views/createcustomfunction.html',
        controller: 'CustomfunctionsdialogcontrollerCtrl',
        scope: $scope.$new(false, $scope),
        clickOutsideToClose: true
      }).then(
        function() {},

        function() {
          angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation
            .customFunctionDeclarations);
        });
    };

  $scope.loadDistribution = function() {
    $mdDialog.show({
      templateUrl: 'views/loaddistribution.html',
      controller: 'LoadDistributionCtrl',
      scope: $scope.$new(false),
      clickOutsideToClose: true
    }).then(function(distribution) {
      $state.go('transformations.transformation.preview', {
        id: $stateParams.id,
        distribution: distribution
      });
    });
  };

  // Save the selected md-tab panel in session because we can
  $scope.transformationSelectedTabIndex =
    window.sessionStorage && window.sessionStorage.transformationSelectedTabIndex ?
    (parseInt(window.sessionStorage.transformationSelectedTabIndex) || 0) : 0;
  $scope.$watch('transformationSelectedTabIndex', function(newValue) {
    window.sessionStorage.transformationSelectedTabIndex = newValue;
  });

  if ($rootScope.currentlyPreviewedFunction) {
    $rootScope.currentlyPreviewedFunction.isPreviewed = false;
  }
});
