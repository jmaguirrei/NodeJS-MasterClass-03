
const helpers = require('../../helpers');
const _data = require('../../data');
const menuItemsData = require('../../../.data/menu/items.js');

// Home page template handler
module.exports = function (templateName) {

  return function (data, callback) {

    // Reject any request that isn't a GET
    if (data.method === 'get') {

      let itemsSubtemplate = '';
      if (templateName === 'menu') {
        menuItemsData.forEach(item => {

          const menuTemplateData = {
            '$menuItem.code': item.code,
            '$menuItem.desc': `${item.type} - ${item.name}`,
            '$menuItem.usd': `$ ${item.price}.00`,
          };

          helpers.getTemplate('menuItem', menuTemplateData, (err3, menuItemStr) => {
            if (!err3 && menuItemStr) {
              itemsSubtemplate = itemsSubtemplate.concat(menuItemStr);
            } else {
              callback(500, undefined, 'html');
            }
          });
        });
      }

      let additionalData = {};
      if (templateName === 'orderCart') {
        const { orderId } = data.queryStringObject;
        /* eslint-disable no-sync */
        const orderObject = _data.readSync('orders', orderId);
        if (orderObject) {
          additionalData['$orderCart.items'] = orderObject.order.description;
          additionalData['$orderCart.price'] = '$ ' + orderObject.order.amount + '.00';
        }
      }

      if (templateName === 'error') {
        const { desc } = data.queryStringObject;
        additionalData['$error.desc'] = desc;
      }


      // Prepare data for interpolation (all templates at once!)
      const pageTemplateData = {
        '$home.title': 'Pollos Hermanos Pizza\'s Delivery',
        '$menu.itemsSubtemplate': itemsSubtemplate,
        ...additionalData,
      };

      // Read in a template as a string
      helpers.getTemplate(templateName, pageTemplateData, (err1, pageStr) => {
        if (!err1 && pageStr) {
          // Add the universal header and footer
          const docTemplateData = {
            '$doc.body': pageStr,
          };
          helpers.getTemplate('_document', docTemplateData, (err2, documentStr) => {
            if(!err2 && documentStr) {
              // Return that page as HTML
              callback(200, documentStr, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  };

};
