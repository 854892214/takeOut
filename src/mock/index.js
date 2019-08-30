import Mock from 'mockjs';

Mock.setup({
  timeout: '200-600'
});

Mock.mock(/\/mobi\/store\/goodsh5Info/, "get", require('./json/h5Config'));
Mock.mock(/\/mobi\/goodsmicromallorder\/goods\/list/, "post", require('./json/categoryList'));
