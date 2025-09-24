import React, { useEffect } from 'react';
import { loginRedirectCall } from './RedirectPathMange';

export default function RedirectBlankPage(): React.JSX.Element {
  useEffect(() => {
    loginRedirectCall();
  }, []);

  return <div />;
}