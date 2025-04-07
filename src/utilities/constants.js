export const BASE_API_URL = "https://p01--payment-backend--956bql6nq7mj.code.run/ev/v1/rest/api/";
export const ENDPOINTS = {
    // users
    GET_USERS: 'users',
    UPDATE_USER: 'users',
    CREATE_USER: 'users',
    CREATE_USER_ROLES: 'users/{id}/roles',
    UPDATE_USER_PASSWORD: 'users/resetPassword',
    QUERY_USERS: 'users/query',
    LOGOUT_USER: 'users/logout',
    GET_USER: 'users/{id}',
    DELETE_USER: 'users/{id}',

    // transaction
    UPDATE_TRANSACTIONS: 'trans',
    CREATE_TRANSACTION: 'trans',
    QUERY_TRANSACTIONS: 'trans/query',
    GET_TRANSACTION: 'trans/{id}',
    GET_TRANSACTION_DASHBOARD: 'trans/dashboard/',

    // role
    GET_ROLES: 'roles',
    UPDATE_ROLES: 'roles',
    CREATE_ROLE: 'roles',
    UPDATE_USER_ROLE: 'roles/{roleId}/{userId}',
    ADD_ROLE_PERMISSIONS: 'roles/{roleId}/permissions',
    ADD_ROLE_USERS: 'roles/{roleId}/add_users',
    QUERY_ROLES: 'roles/query',
    GET_ROLE: 'roles/{id}',
    DELETE_ROLE: 'roles/{id}',

    // permission
    GET_PERMISSIONS: 'permissions',
    UPDATE_PERMISSIONS: 'permissions',
    CREATE_PERMISSION: 'permissions',
    QUERY_PERMISSIONS: 'permissions/query',
    GET_PERMISSION: 'permissions/{id}',
    DELETE_PERMISSION: 'permissions/{id}',

    // package
    GET_PACKAGES: 'packages',
    UPDATE_PACKAGES: 'packages',
    CREATE_PACKAGE: 'packages',
    QUERY_PACKAGES: 'packages/query',
    GET_PACKAGE: 'packages/{id}',
    DELETE_PACKAGE: 'packages/{id}',

    // package tiers
    GET_PACKAGE_TIERS: 'package-tiers',
    UPDATE_PACKAGE_TIER: 'package-tiers',
    CREATE_PACKAGE_TIER: 'package-tiers',
    SEARCH_PACKAGE_TIERS: 'package-tiers/query',
    GET_PACKAGE_TIER: 'package-tiers/{id}',
    DELETE_PACKAGE_TIER: 'package-tiers/{id}',

    // currency
    GET_CURRENCIES: 'currencies',
    UPDATE_CURRENCIES: 'currencies',
    CREATE_CURRENCY: 'currencies',
    QUERY_CURRENCIES: 'currencies/query',
    GET_CURRENCY: 'currencies/{id}',
    DELETE_CURRENCY: 'currencies/{id}',

    // client
    GET_CLIENTS: 'clients',
    UPDATE_CLIENT: 'clients',
    CREATE_CLIENT: 'clients',
    CREATE_CLIENT_ROLES: 'clients/{id}/roles',
    UPDATE_CLIENT_PASSWORD: 'clients/resetPassword',
    QUERY_CLIENTS: 'clients/query',
    GET_CLIENT: 'clients/{id}',
    DELETE_CLIENT: 'clients/{id}',
    
    // account
    GET_ACCOUNTS: 'accounts',
    UPDATE_ACCOUNT: 'accounts',
    CREATE_ACCOUNT: 'accounts',
    QUERY_ACCOUNTS: 'accounts/query',
    ACCOUNT_UPLOAD_QR: 'accounts/{id}/upload-qr',
    GET_ACCOUNT: 'accounts/{id}',
    ACCOUNT_GET_QR: 'accounts/{id}/qr-code',
    DELETE_ACCOUNT: 'accounts/{id}',

    // auth
    RESET_PASSWORD: 'auth/resetPassword',
    REGISTER: 'auth/register',
    REFRESH: 'auth/refresh',
    LOGIN: 'auth/login',

    // alipay
    ALIPAY_CREATE_RETURN_URL: 'alipay/returnUrl',
    ALIPAY_CREATE_WEB_PAY: 'alipay/pay/web',
    ALIPAY_CREATE_WAP_PAY: 'alipay/pay/wap',
    ALIPAY_CREATE_NOTIFY_URL: 'alipay/notifyUrl',
    ALIPAY_REFUND: 'alipay/refund',
    ALIPAY_QUERY: 'alipay/query',
    ALIPAY_QUERY_REFUND: 'alipay/query-refund',
    ALIPAY_CLOSE: 'alipay/close',
    ALIPAY_CANCEL: 'alipay/cancel',

    // test-user
    TEST_USER_READ: 'testUser/user-read',
    TEST_USER_MODIFY: 'testUser/mod',
    TEST_USER_ALL: 'testUser/all',
    TEST_USER_ADMIN: 'testUser/admin',
    TEST_USER_ADMIN_UPDATE: 'testUser/admin-update',
    TEST_USER_ADMIN_READ: 'testUser/admin-read',
    TEST_USER_ADMIN_READ_WRITE: 'testUser/admin-read-write',
    TEST_USER_ADMIN_DELETE: 'testUser/admin-delete',
}

// Roles
export const ROLES = {
    READ: "READ",
    DELETE: "DELETE",
    CREATE: "CREATE",
    ROLE_CLIENT: "ROLE_CLIENT",
    UPDATE: "UPDATE",
    ROLE_ADMIN: "ROLE_ADMIN",
}

// Transaction Types
export const TRANSACTION_TYPES = {
    DEPOSIT: 0,
    WITHDRAWAL: 1,
    REFUND: 2,
}

// Transaction Status
export const TRANSACTION_STATUS = {
    PENDING: 0,
    COMPLETED: 1,
    REFUNDED: 2,
    FAILED: 3,
    CANCEL: 4,
    CLOSE: 5,
}

// Account Status
export const ACCOUNT_STATUS = {
    ACTIVE: 0,
    INACTIVE: 1,
    SUSPENDED: 2,
}
