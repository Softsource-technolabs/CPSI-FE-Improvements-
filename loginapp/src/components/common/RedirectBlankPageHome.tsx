import React, { useEffect } from 'react';
import { homeRedirectCall } from './RedirectPathMange';


export default function RedirectBlankPageHome(): React.JSX.Element {
  useEffect(() => {
    homeRedirectCall();
  }, []);

  return <div />;
}
