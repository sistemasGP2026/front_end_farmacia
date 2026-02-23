import styled from "styled-components";

const ContactWrapper = styled.div`
  .contact-container {
    .box-glow {
      background: rgba(0, 0, 0, 0.035);
      color: rgba(0, 0, 0, 0.87);
    }
    .left-panel-list {
      cursor: pointer;
      padding: 5px 15px;
      display: flex;
      align-items: center;
      font-size: 15px;
      &:focus {
        color: #16181b;
        background-color: transparent;
        outline: 0;
      }
      &:active {
        color: #16181b;
        outline: 0;
      }
      .list-title-logo {
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .left-panel-container {
      background: white;
      height: 100%;
      .left-panel-header {
        padding: 10px 15px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
    .contact-profile-image {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    .title-table {
      padding-left: 300px
    }

    .contact-profile-no-image {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      background: ${props => props.sidebarTheme.activeRouteBackColor};
      color: ${props => props.sidebarTheme.activeRouteTextColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-panel {
      background: white;
      height: 100%; 
      .contact-list-header {
        padding: 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .add-contact {
          font-size: 24px;
          color: #563c91;
          cursor: pointer;
        }
        .contact-action-dropdown {
          .dropdown-toggle {
            font-weight: 300;
            background-color: rgba(0, 0, 0, 0.035);
            color: rgba(0, 0, 0, 0.87);
            border: 0;
          }
        }
      }
      .more-vert-icon {
        cursor: pointer;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.4);
      }
      .no-found-message {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.4);
        padding: 15px 0;
      }
      .contact-table {
        overflow-x: auto;
        .contact-fav-icon {
          cursor: pointer;
          font-size: 16px;
          color: #e91e63;
        }
        td {
          vertical-align: middle;
        }
      }
    }
    .contact-selection input:checked ~ .state.p-primary label:after,
    .pretty.p-toggle .state.p-primary label:after {
      background-color: #563c91 !important;
    }

    .search-contant {
      background-color: transparent;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      border: 0;
      outline: 0;
      cursor: pointer;
      i {
        color: #6c757d;
        font-size: 18px;
      }
    }
  }

  //--------------------------------------------------------------------
  $contrast-color: #8dc63f;
$accent-color: #2d9cdb;
$main-color: #555555;
$danger-color: #a94442;
// ----
@keyframes toRight{
  from{
    transform: rotate(0);
  }
  to{
    transform: rotate(360deg);
  }
}

@keyframes time{
  from{
    transform:  translate(61%, 0%) rotate(0);
  }
  to{
    transform:  translate(61%, 0%) rotate(360deg);
  }
}


@mixin centered{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
}

@keyframes toLeft{
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(-360deg);
  }
}

$circle-size: 250;
.preloader{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $main-color;
  display: flex;
  align-items: center;
  justify-content: center;
  &__mesage{
    color: #fff;
    font-weight: normal;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
  }
  &__img-container{
    height: ($circle-size+ 10)+px;
    width: ($circle-size+ 10)+px;
    position: relative;
  }
  &__item{
    height: $circle-size+px;
    width: $circle-size+px;
    border-radius: 50%;
    box-sizing: border-box;
    @include centered;
    &:after{
      content: '';
      height: 100%;
      width: 100%;
      display: block;
      @include centered;
      border-radius: 50%;
      border: 6px solid $accent-color;
      clip-path: inset(0 0 50% 0);
      z-index: 1;
      animation: toRight 2s infinite linear;
    }
    &--mid{
      height: ($circle-size - 20)+px;
      width: ($circle-size - 20)+px;
      &::after{
         border-color: lighten($accent-color, 20%);
         border-width: 4px;
         z-index: 2;
         animation: toLeft 2s infinite linear .3s;
      }
    }
    &--inner{
      height: ($circle-size - 40)+px;
      width: ($circle-size - 40)+px;
      &::after{
        border-color: lighten($accent-color, 40%);
        border-width: 3px;
        z-index: 3;
        transform: rotate(-45deg);
      }
    }
  }
  &__clock{
    width: ($circle-size - 80)+px;
    height: ($circle-size - 80)+px;
    @include centered;
    z-index: 4;
    left: 0;
    border-radius: 50%;
  }
}
.clock{
  transform: rotate(-29deg);
  &__center{
    display: block;
    height: 10px;
    width: 10px;
    background-color: #fff;
    border-radius: 50%;
    @include centered;
    transform: translate(5px);
  }
  &__dots{
    @include centered;
    z-index: 1;
    height: 1px;
    width: 100%;
    border: {
      left: 3px solid #fff;
      right: 3px solid #fff;
    }
    &:nth-of-type(1),
    &:nth-of-type(4n){
      border: {
        left: 8px solid #fff;
        right: 8px solid #fff;
      }
    }
    @for $i from 1 through 12 {
      &:nth-of-type(#{$i}){
        transform: rotate(((360/12)*$i)+deg);
      }
    }
  }
  &::after,
  &::before{
    content: '';
    display: block;
    background-color: #fff;
    @include centered;
  }
  &::after{
    height: 5px;
    width: 45%;
    right: 5%;
    transform-origin: left center;
    animation: time 12s infinite linear;
  }
  &::before{
    height: 2px;
    width: 45%;
    right: 5%;
    transform-origin: left center;
    animation: time .6s infinite linear;
    
  }
}
`;

export default ContactWrapper;
