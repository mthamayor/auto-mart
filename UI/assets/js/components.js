const footer = `
  <div class = "footer">
    <div>
      <p class= "header">Our Services</p>
      <ul>
        <li>Sell a Car</li>
        <li>Buy a Car</li>
      </ul>
    </div>

    <div>
      <p class="header"><i class="line-icon lni-car"></i>Vehicles</p>
      <ul>
        <li>Cars</li>
        <li>Trucks</li>
        <li>Trailers</li>
        <li>Van</li>
      </ul>
    </div>

    <div>
      <p class="header"><i class="line-icon lni-map-marker"></i> Our Location</p>
      <p>50 Ikorodu road, Ilupeju, Lagos</p>
      <p>+23-481-333-53249</p>
    </div>
  </div>
`;

const mainNav = `
    <div class="logo"><a class="logo-link" href="./index.html"><img src="./assets/img/logo.png" /></a></div>
    <ul class="links d-sm-none">
      <li><a href="index.html">Home</a></li>
      <li><a href="./search-cars.html">Our Cars</a></li>
      <li><a href="./signup.html">Sign Up</a></li>
      <li><a href="./signin.html">Sign In</a></li>
    </ul>
    <span class="menu-toggle"><i class="menu-toggle-icon lni-menu"></i></span>
`;

const loggedNav = `
  <div class="logo"><a class="logo-link" href="./dashboard.html"><img src="./assets/img/logo.png" /></a></div>
    <ul class="links d-sm-none">
      <li class="home-link"><a href="dashboard.html">Home</a></li>
      <li class="dropdown">
        <a class="cursor-pointer d-sm-none">Adverts</a>
        <ul class="dropdown-content">
          <li><a href="./create-ad.html"><i class="icons lni-car"></i>Create Adverts</a></li>
          <li><a href="./my-adverts.html"><i class="icons lni-cart-full"></i>My Adverts</a></li>
        </ul>
      </li>
      <li><a href="./search-cars.html">View Cars</a></li>
      <li><a href="#">Sign out</a></li>
    </ul>
    <span class="links"><a href="search-cars.html"><i class="lni-search"></i>Search</a></span>
    <span class="menu-toggle"><i class="menu-toggle-icon lni-menu"></i></span>
`;