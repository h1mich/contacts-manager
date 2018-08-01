import React from 'react';

export default class CMLoader extends React.Component {
  render() {
    return <div style={ styles.root }/>;
  }
}

const styles = {
  root: {
    height: '100%',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    backgroundColor: 'white',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRkZGIiAvPjxnPjxwYXRoIGQ9Ik03NS40IDEyNi42M2ExMS40MyAxMS40MyAwIDAgMS0yLjEtMjIuNjUgNDAuOSA0MC45IDAgMCAwIDMwLjUtMzAuNiAxMS40IDExLjQgMCAxIDEgMjIuMjcgNC44N2guMDJhNjMuNzcgNjMuNzcgMCAwIDEtNDcuOCA0OC4wNXYtLjAyYTExLjM4IDExLjM4IDAgMCAxLTIuOTMuMzd6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiLz48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCA2NCA2NCIgdG89IjM2MCA2NCA2NCIgZHVyPSIxODAwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg==)',
    opacity: '0.8'
  }
};
