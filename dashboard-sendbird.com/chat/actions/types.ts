export enum ChannelsActionTypes {
  CREATE_OPEN_CHANNEL_REQUEST = 'CREATE_OPEN_CHANNEL_REQUEST',
  CREATE_OPEN_CHANNEL_SUCCESS = 'CREATE_OPEN_CHANNEL_SUCCESS',
  CREATE_OPEN_CHANNEL_FAIL = 'CREATE_OPEN_CHANNEL_FAIL',
  CREATE_OPEN_CHANNEL_CANCEL = 'CREATE_OPEN_CHANNEL_CANCEL',

  FETCH_METADATA_REQUEST = 'FETCH_METADATA_REQUEST',
  FETCH_METADATA_SUCCESS = 'FETCH_METADATA_SUCCESS',
  FETCH_METADATA_FAIL = 'FETCH_METADATA_FAIL',
  FETCH_METADATA_CANCEL = 'FETCH_METADATA_CANCEL',

  SET_METADATA_REQUEST = 'SET_METADATA_REQUEST',
  SET_METADATA_SUCCESS = 'SET_METADATA_SUCCESS',
  SET_METADATA_FAIL = 'SET_METADATA_FAIL',
  SET_METADATA_CANCEL = 'SET_METADATA_CANCEL',

  DELETE_CHANNELS_REQUEST = 'DELETE_CHANNELS_REQUEST',
  DELETE_CHANNELS_SUCCESS = 'DELETE_CHANNELS_SUCCESS',
  DELETE_CHANNELS_FAIL = 'DELETE_CHANNELS_FAIL',
  DELETE_CHANNELS_CANCEL = 'DELETE_CHANNELS_CANCEL',

  FETCH_OPEN_CHANNELS_REQUEST = 'FETCH_OPEN_CHANNELS_REQUEST',
  FETCH_OPEN_CHANNELS_SUCCESS = 'FETCH_OPEN_CHANNELS_SUCCESS',
  FETCH_OPEN_CHANNELS_FAIL = 'FETCH_OPEN_CHANNELS_FAIL',

  FETCH_GROUP_CHANNELS_REQUEST = 'FETCH_GROUP_CHANNELS_REQUEST',
  FETCH_GROUP_CHANNELS_SUCCESS = 'FETCH_GROUP_CHANNELS_SUCCESS',
  FETCH_GROUP_CHANNELS_FAIL = 'FETCH_GROUP_CHANNELS_FAIL',

  RESET_OPEN_CHANNELS_SEARCH = 'RESET_OPEN_CHANNELS_SEARCH',
  RESET_GROUP_CHANNELS_SEARCH = 'RESET_GROUP_CHANNELS_SEARCH',

  SEARCH_OPEN_CHANNELS_REQUEST = 'SEARCH_OPEN_CHANNELS_REQUEST',
  SEARCH_OPEN_CHANNELS_SUCCESS = 'SEARCH_OPEN_CHANNELS_SUCCESS',
  SEARCH_OPEN_CHANNELS_FAIL = 'SEARCH_OPEN_CHANNELS_FAIL',

  SEARCH_GROUP_CHANNELS_REQUEST = 'SEARCH_GROUP_CHANNELS_REQUEST',
  SEARCH_GROUP_CHANNELS_SUCCESS = 'SEARCH_GROUP_CHANNELS_SUCCESS',
  SEARCH_GROUP_CHANNELS_FAIL = 'SEARCH_GROUP_CHANNELS_FAIL',

  FETCH_OPEN_CHANNEL_REQUEST = 'FETCH_OPEN_CHANNEL_REQUEST',
  FETCH_OPEN_CHANNEL_SUCCESS = 'FETCH_OPEN_CHANNEL_SUCCESS',
  FETCH_OPEN_CHANNEL_FAIL = 'FETCH_OPEN_CHANNEL_FAIL',

  FETCH_GROUP_CHANNEL_REQUEST = 'FETCH_GROUP_CHANNEL_REQUEST',
  FETCH_GROUP_CHANNEL_FAIL = 'FETCH_GROUP_CHANNEL_FAIL',

  SET_OPEN_CHANNEL_SEARCH_QUERY = 'SET_OPEN_CHANNEL_SEARCH_QUERY',
  SET_OPEN_CHANNEL_SEARCH_STATE = 'SET_OPEN_CHANNEL_SEARCH_STATE',
  SET_OPEN_CHANNEL_SEARCH_SUCCESS = 'SET_OPEN_CHANNEL_SEARCH_SUCCESS',
  SET_OPEN_CHANNEL_SEARCH_OPTION = 'SET_OPEN_CHANNEL_SEARCH_OPTION',

  SET_GROUP_CHANNEL_SEARCH_QUERY = 'SET_GROUP_CHANNEL_SEARCH_QUERY',
  SET_GROUP_CHANNEL_SEARCH_STATE = 'SET_GROUP_CHANNEL_SEARCH_STATE',
  SET_GROUP_CHANNEL_SEARCH_SUCCESS = 'SET_GROUP_CHANNEL_SEARCH_SUCCESS',
  SET_GROUP_CHANNEL_SEARCH_OPTION = 'SET_GROUP_CHANNEL_SEARCH_OPTION',
  SET_GROUP_CHANNEL_SHOW_EMPTY_CHANNELS = 'SET_GROUP_CHANNEL_SHOW_EMPTY_CHANNELS',

  SET_CURRENT_OPEN_CHANNEL = 'SET_CURRENT_OPEN_CHANNEL',
  SET_CURRENT_GROUP_CHANNEL = 'SET_CURRENT_GROUP_CHANNEL',

  UPDATE_OPEN_CHANNEL_IN_LIST = 'UPDATE_OPEN_CHANNEL_IN_LIST', // update one channel information in reducer's list
  UPDATE_GROUP_CHANNEL_IN_LIST = 'UPDATE_GROUP_CHANNEL_IN_LIST', // update one channel information in reducer's list

  GO_TO_MODERATION = 'GO_TO_MODERATION',
}

// moderations
export enum ModerationsActionTypes {
  SEND_ADMIN_MESSAGE_REQUEST = 'SEND_ADMIN_MESSAGE_REQUEST',
  SEND_ADMIN_MESSAGE_SUCCESS = 'SEND_ADMIN_MESSAGE_SUCCESS',
  SEND_ADMIN_MESSAGE_FAIL = 'SEND_ADMIN_MESSAGE_FAIL',
  SEND_ADMIN_MESSAGE_CANCEL = 'SEND_ADMIN_MESSAGE_CANCEL',

  EDIT_MESSAGE_REQUEST = 'EDIT_MESSAGE_REQUEST',
  EDIT_MESSAGE_SUCCESS = 'EDIT_MESSAGE_SUCCESS',
  EDIT_MESSAGE_FAIL = 'EDIT_MESSAGE_FAIL',
  EDIT_MESSAGE_CANCEL = 'EDIT_MESSAGE_CANCEL',

  UPDATE_OPEN_CHANNELS_MESSAGES = 'UPDATE_OPEN_CHANNELS_MESSAGES',
  UPDATE_OPEN_CHANNELS_MESSAGE = 'UPDATE_OPEN_CHANNELS_MESSAGE',
  DELETE_OPEN_CHANNELS_MESSAGE = 'DELETE_OPEN_CHANNELS_MESSAGE',

  RESET_OPEN_CHANNELS = 'RESET_OPEN_CHANNELS',
  RESET_GROUP_CHANNELS = 'RESET_GROUP_CHANNELS',

  TOGGLE_OPEN_CHANNEL_SCROLL_LOCK = 'TOGGLE_OPEN_CHANNEL_SCROLL_LOCK',
  TOGGLE_GROUP_CHANNEL_SCROLL_LOCK = 'TOGGLE_GROUP_CHANNEL_SCROLL_LOCK',

  RESET_OPEN_CHANNELS_MODERATION_DATA = 'RESET_OPEN_CHANNELS_MODERATION_DATA',
  RESET_GROUP_CHANNELS_MODERATION_DATA = 'RESET_GROUP_CHANNELS_MODERATION_DATA',

  BAN_USER_REQUEST = 'BAN_USER_REQUEST',
  BAN_USER_SUCCESS = 'BAN_USER_SUCCESS',
  BAN_USER_FAIL = 'BAN_USER_FAIL',

  UNBAN_USER_REQUEST = 'UNBAN_USER_REQUEST',
  UNBAN_USER_SUCCESS = 'UNBAN_USER_SUCCESS',
  UNBAN_USER_FAIL = 'UNBAN_USER_FAIL',

  MUTE_USER_REQUEST = 'MUTE_USER_REQUEST',
  MUTE_USER_SUCCESS = 'MUTE_USER_SUCCESS',
  MUTE_USER_FAIL = 'MUTE_USER_FAIL',

  UNMUTE_USER_REQUEST = 'UNMUTE_USER_REQUEST',

  SET_PARTICIPANTS = 'SET_PARTICIPANTS',

  SET_OPEN_CHANNELS_IS_ENTERED = 'SET_OPEN_CHANNELS_IS_ENTERED',
}

// messages
export enum MessagesActionTypes {
  SEARCH_MESSAGES_REQUEST = 'SEARCH_MESSAGES_REQUEST',
  SEARCH_MESSAGES_SUCCESS = 'SEARCH_MESSAGES_SUCCESS',
  SEARCH_MESSAGES_FAIL = 'SEARCH_MESSAGES_FAIL',

  // FETCH_MESSAGE_REQUEST = 'FETCH_MESSAGE_REQUEST',
  // FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS',
  // FETCH_MESSAGE_FAIL = 'FETCH_MESSAGE_FAIL',

  RECOVER_MESSAGE_REQUEST = 'RECOVER_MESSAGE_REQUEST',
  RECOVER_MESSAGE_SUCCESS = 'RECOVER_MESSAGE_SUCCESS',
  RECOVER_MESSAGE_FAIL = 'RECOVER_MESSAGE_FAIL',

  UPDATE_MESSAGE_REQUEST = 'UPDATE_MESSAGE_REQUEST',
  UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS',
  UPDATE_MESSAGE_FAIL = 'UPDATE_MESSAGE_FAIL',

  DELETE_MESSAGES_REQUEST = 'DELETE_MESSAGES_REQUEST',
  DELETE_MESSAGES_SUCCESS = 'DELETE_MESSAGES_SUCCESS',
  DELETE_MESSAGES_FAIL = 'DELETE_MESSAGES_FAIL',

  DELETE_MESSAGE_REQUEST = 'DELETE_MESSAGE_REQUEST',
  DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS',
  DELETE_MESSAGE_FAIL = 'DELETE_MESSAGE_FAIL',

  DELETE_ALL_CHANNEL_MESSAGES_REQUEST = 'DELETE_ALL_CHANNEL_MESSAGES_REQUEST',
  DELETE_ALL_CHANNEL_MESSAGES_SUCCESS = 'DELETE_ALL_CHANNEL_MESSAGES_SUCCESS',
  DELETE_ALL_CHANNEL_MESSAGES_FAIL = 'DELETE_ALL_CHANNEL_MESSAGES_FAIL',

  SET_MESSAGES_SEARCH_OPTIONS = 'SET_MESSAGES_SEARCH_OPTIONS',

  RESET_MESSAGES_REQUEST = 'RESET_MESSAGES_REQUEST',

  SET_MESSAGES_ACTIVE_TAB = 'SET_MESSAGES_ACTIVE_TAB',
}

// analytics
export enum AnalyticsActionTypes {
  EXPORT_ANALYTICS_REQUEST = 'EXPORT_ANALYTICS_REQUEST',
  EXPORT_ANALYTICS_SUCCESS = 'EXPORT_ANALYTICS_SUCCESS',
  EXPORT_ANALYTICS_FAIL = 'EXPORT_ANALYTICS_FAIL',
}
