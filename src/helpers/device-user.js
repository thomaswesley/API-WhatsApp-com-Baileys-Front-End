import useMediaQuery from '@mui/material/useMediaQuery';

const GetDeviceUser = () => {

  const mobilePortraitMinWidth = useMediaQuery('(min-width:320px)');
  const mobilePortraitMaxWidth = useMediaQuery('(max-width:480px)');

  const mobileLandscapeMinWidth = useMediaQuery('(min-width:481px)');
  const mobileLandscapeMaxWidth = useMediaQuery('(max-width:767px)');

  const desktopsMinWidth = useMediaQuery('(min-width:1281px)');
  const desktopsLargeScreenResolutionMinWidth = useMediaQuery('(min-width:1920px)');

  const desktopsAndLaptopsMinWidth = useMediaQuery('(min-width:1025px)');
  const desktopsAndLaptopsMaxWidth = useMediaQuery('(max-width:1280px)');

  const tabletsAndIpadsPortraitMinWidth = useMediaQuery('(min-width:768px)');
  const tabletsAndIpadsPortraitMaxWidth = useMediaQuery('(max-width:1024px)');

  if (mobilePortraitMinWidth && mobilePortraitMaxWidth) {

    return {

      mobilePortrait: true,
      mobileLandscape: false,
      desktops: false,
      desktopsLargeScreenResolution: false,
      desktopsAndLaptops: false,
      tabletsAndIpadsPortrait: false
    }
  }

  if (mobileLandscapeMinWidth && mobileLandscapeMaxWidth) {

    return {

      mobilePortrait: false,
      mobileLandscape: true,
      desktops: false,
      desktopsLargeScreenResolution: false,
      desktopsAndLaptops: false,
      tabletsAndIpadsPortrait: false
    }
  }

  if (desktopsMinWidth) {

    return {

      mobilePortrait: false,
      mobileLandscape: false,
      desktops: true,
      desktopsLargeScreenResolution: false,
      desktopsAndLaptops: false,
      tabletsAndIpadsPortrait: false
    }
  }

  if (desktopsLargeScreenResolutionMinWidth) {

    return {

      mobilePortrait: false,
      mobileLandscape: false,
      desktops: false,
      desktopsLargeScreenResolution: true,
      desktopsAndLaptops: false,
      tabletsAndIpadsPortrait: false
    }
  }

  if (desktopsAndLaptopsMinWidth && desktopsAndLaptopsMaxWidth) {

    return {

      mobilePortrait: false,
      mobileLandscape: false,
      desktops: false,
      desktopsLargeScreenResolution: false,
      desktopsAndLaptops: true,
      tabletsAndIpadsPortrait: false
    }
  }

  if (tabletsAndIpadsPortraitMinWidth && tabletsAndIpadsPortraitMaxWidth) {

    return {

      mobilePortrait: false,
      mobileLandscape: false,
      desktops: false,
      desktopsLargeScreenResolution: false,
      desktopsAndLaptops: false,
      tabletsAndIpadsPortrait: true
    }
  }

  return false
}

export default GetDeviceUser
