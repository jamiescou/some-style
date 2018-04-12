import Cookies from 'cookies-js';
let orgName = Cookies.get('_orgname') || 'meiqia';

export default {
    version: 'v1.0',
    _tenant_id: Cookies.get('_tenant_id'),
    orgName
};
