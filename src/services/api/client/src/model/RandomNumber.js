/**
 * Echalo A Suerte
 * API definition for EAS web services
 *
 * OpenAPI spec version: 1.0.0
 * Contact: mariocj89@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */


import ApiClient from '../ApiClient';
import RandomNumberResult from './RandomNumberResult';





/**
* The RandomNumber model module.
* @module model/RandomNumber
* @version 1.0.0
*/
export default class RandomNumber {
    /**
    * Constructs a new <code>RandomNumber</code>.
    * @alias module:model/RandomNumber
    * @class
    */

    constructor() {
        

        
        

        

        
    }

    /**
    * Constructs a <code>RandomNumber</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/RandomNumber} obj Optional instance to populate.
    * @return {module:model/RandomNumber} The populated <code>RandomNumber</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new RandomNumber();

            
            
            

            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
            if (data.hasOwnProperty('private_id')) {
                obj['private_id'] = ApiClient.convertToType(data['private_id'], 'String');
            }
            if (data.hasOwnProperty('created')) {
                obj['created'] = ApiClient.convertToType(data['created'], 'String');
            }
            if (data.hasOwnProperty('last_updated')) {
                obj['last_updated'] = ApiClient.convertToType(data['last_updated'], 'String');
            }
            if (data.hasOwnProperty('title')) {
                obj['title'] = ApiClient.convertToType(data['title'], 'String');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
            if (data.hasOwnProperty('range_min')) {
                obj['range_min'] = ApiClient.convertToType(data['range_min'], 'Number');
            }
            if (data.hasOwnProperty('range_max')) {
                obj['range_max'] = ApiClient.convertToType(data['range_max'], 'Number');
            }
            if (data.hasOwnProperty('results')) {
                obj['results'] = ApiClient.convertToType(data['results'], [RandomNumberResult]);
            }
        }
        return obj;
    }

    /**
    * @member {String} id
    */
    id = undefined;
    /**
    * @member {String} private_id
    */
    private_id = undefined;
    /**
    * @member {String} created
    */
    created = undefined;
    /**
    * @member {String} last_updated
    */
    last_updated = undefined;
    /**
    * @member {String} title
    */
    title = undefined;
    /**
    * @member {String} description
    */
    description = undefined;
    /**
    * @member {Number} range_min
    */
    range_min = undefined;
    /**
    * @member {Number} range_max
    */
    range_max = undefined;
    /**
    * @member {Array.<module:model/RandomNumberResult>} results
    */
    results = undefined;








}

