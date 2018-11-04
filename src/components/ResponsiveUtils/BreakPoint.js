import React from 'react';
import MediaQuery from 'react-responsive';

const breakpoints = {
  default: '(min-width: 1024px)',
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1025px)',
  tabletLandscape: '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
  tabletPortrait: '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
  mobileLandscape: '(min-width: 481px) and (max-width: 767px)',
  mobilePortrait: '(min-width: 320px) and (max-width: 480px)'
};

export function Breakpoint(props) {
  const breakpoint = breakpoints[props.device] || breakpoints.desktop;
  return (
    <MediaQuery {...props } query={breakpoint}>
      {props.children}
    </MediaQuery>
  );
}

export function MinDesktop(props) {
  return (
    <Breakpoint device='default'>
      {props.children}
    </Breakpoint>
  );
}

export function MinTablet(props) {
  return (
    <Breakpoint device='tablet'>
      {props.children}
    </Breakpoint>
  );
}

export function Desktop(props) {
  return (
    <Breakpoint device='desktop'>
      {props.children}
    </Breakpoint>
  );
}

export function TabletLandscape(props) {
  return (
    <Breakpoint device='tabletLandscape'>
      {props.children}
    </Breakpoint>
  );
}

export function TabletPortrait(props) {
  return (
    <Breakpoint device='tabletPortrait'>
      {props.children}
    </Breakpoint>
  );
}

export function MobileLandscape(props) {
  return (
    <Breakpoint device='mobileLandscape'>
      {props.children}
    </Breakpoint>
  );
}

export function MobilePortrait(props) {
  return (
    <Breakpoint device='mobilePortrait'>
      {props.children}
    </Breakpoint>
  );
}
