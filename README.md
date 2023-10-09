# preppal

# cj dropshipping methods

# get product info

const urll = 'https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=9633D08C-B0F9-4824-8A59-546701C389C6';
const headerss = {
  'CJ-Access-Token': `${process.env.CJ_ACCESS_TOKEN}`, // Replace with your actual access token
};

axios.get(urll, { headerss })
  .then(response => {
    // Handle the response data here
    console.log(response.data);
  })
  .catch(error => {
    // Handle any errors here
    console.error(error);
  });
