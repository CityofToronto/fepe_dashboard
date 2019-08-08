class SampleApp extends (window['CotApp'] || window['CotApp']) {
  constructor() {
    super();
    this.$container = $('#fepe_dashboard_container');
    this.currentlySelectedSection = '';
    this.renderedSections = {};
  }

  render() {
    //@if !IS_EMBEDDED
    super.render(); //this function only exists in CotApp
    //@endif

    this.startRouter();

  }

  startRouter() {
    new (Backbone.Router.extend({
      routes: {
        "": () => {
          this.showSection('welcome');
        },
        ":sectionName": (sectionName) => {
          let parts = sectionName.split('_');
          if (parts.length > 1 && this.$('#'+sectionName).length === 1) {
            this.showSection(parts[parts.length-1]);
          } else {
            this.showSection('welcome');
          }
        }
      }
    }))();
    Backbone.history.start();
  }

  showSection(sectionId){
    this.$('#fepe_dashboard_' + this.currentlySelectedSection).hide();
    this.$('a[href*="#fepe_dashboard_"]').removeClass('selected-section');
    this.$('#fepe_dashboard_' + sectionId).show();
    this.$(`a[href="#fepe_dashboard_${sectionId}"]`).addClass('selected-section');
    this.currentlySelectedSection = sectionId;
    if (!this.renderedSections[sectionId] && typeof this['renderExampleSection_' + sectionId] === 'function') {
      this['renderExampleSection_' + sectionId]();
      this.renderedSections[sectionId] = true;
    }
  }

  renderExampleSection_form(){
    let form = new ExampleForm(this.$('#fepe_dashboard_form > div'));
    form.render();
    this.$('#fepe_dashboard_form > p > button').on('click', function(){
      form.setModel(new CotModel({
        name: 'John Doe',
        phone: '416-555-5555',
        email: 'user@domain.com',
        province: 'ab',
        postalCode: 'H0H0H0',
        birthday: 'Jan 01, 1977',
        website: 'http://www.domain.com',

        creditCard: '',
        languages: ['javascript', 'css', 'html'],
        favoriteLanguage: 'javascript',
        employmentDates: 'Sep 01, 2016 - Sep 01, 2017',
        secret: 'my secret',
        consent: ['yes'],
        comments: '',
        contactList: new CotCollection([
          {
            contact_name: 'Tom Tune',
            contact_email: 'tom@gmail.com'
          }
        ])
      }));
    });
  }

  renderExampleSection_map() {
    let map = new cot_map('mapWrapper',{
      zoom:8,
      enableClustering: false,
      enableFullscreen:true,
      enableSearchBar:true
    });
    map.render();
    map.addMarker({
      title: 'Example Item 1',
      description: 'This is an example description of item 1',
      LatLng: [43.721459,-79.373903]
    });
    map.addFeatureLayer({
      id:"ttc_subway",
      name:"TTC Subway stations",
      enableClustering: false,
      addToControlBox: true,
      url:'https://gis.toronto.ca/arcgis/rest/services/primary/cot_geospatial_webm/MapServer/116',
      pointToLayer:(geojson, latlng)=> L.marker(latlng,{icon:L.icon({
        iconUrl: '/*@echo SRC_PATH*//img/subway.svg',
        iconRetinaUrl: '/*@echo SRC_PATH*//img/subway.svg',
        iconSize: [40, 20],
        iconAnchor: [0, 0],
        popupAnchor: [30, 0],
      })})
    })
  }

  renderExampleSection_calendar() {
    this.$('#fepe_dashboard_calendar > div').fullCalendar({
      theme: false,
      contentHeight: 'auto',
      header: {left: 'prev,next today', center: 'title', right: 'month,agendaWeek,agendaDay'},
      prev: 'left-single-arrow',
      next: 'right-single-arrow',
      editable: false,
      eventLimit: 2,
      views: {agenda: {eventLimit: 12}},
      events: [{
        title: 'Example Event Title',
        color: "blue",
        textColor: "white",
        url: '#',
        start: new Date().toISOString(),
        end: (new Date((new Date()).getTime() + 100000000)).toISOString()
      }],
      eventClick: function(calEvent, clickEvent) {
        alert('You clicked an event: ' + calEvent.title);
        return false;
      }
    });
  }

  //@if !IS_EMBEDDED
  renderExampleSection_login() {
    let login = new cot_login({
      appName: 'my_app', //Required, the name of your app, this will be sent to the CC AuthSession API call to login
      ccRoot: 'https://was-intra-sit.toronto.ca', //Optional, defaults to '' (the current protocol and domain will be used), use this to specify the <protocol>:://<domain> to use for the CC AuthSession API call
      ccPath: '', //Optional, when specified, this overrides the ccApiPath option of CotSession
      ccEndpoint: '', //Optional, when specified, this overrides the ccApiEndpoint option of CotSession
      welcomeSelector: '#fepe_dashboard_login > div', //Optional, a jquery selector string for the element where the login/logout information should be displayed
      loginMessage: 'Because this is only an example, this login will fail every time.', //Optional, an HTML string to display on the login form, this can be used to explain to the user why they are logging in
      onLogin: function(cot_login_instance) {
        //Optional, a function that will be called after the user logs in successfully
      }
    });
    login.showLogin();
  }
  //@endif

  renderExampleSection_modals() {
    this.$('#fepe_dashboard_modals')
      .append('<p>You can use the showModal method of CotApp or CotApp to show AODA-compliant modal dialogs. Here are some examples:</p>')
      .append($('<button class="btn btn-info">Show a simple modal dialog</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            title: 'A simple dialog',
            body: '<p>This is a paragraph in the <strong>dialog</strong> box.</p>',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show a more complex modal dialog</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            title: 'A complex dialog',
            body: '<p>This is the dialog body.</p>',
            footerButtonsHtml: '<button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button><button class="btn btn-primary" type="button" data-dismiss="modal">Ok</button>',
            modalSize: 'modal-sm',
            originatingElement: $(clickEvent.currentTarget),
            className: 'custom-modal',
            onShow: function () {

            },
            onShown: function () {
              $('.custom-modal .modal-body').append('<p>This paragraph was added after the modal was shown</p>');
            },
            onHide: function () {
            },
            onHidden: function () {
            }
          });
        })
      )
      .append($('<br><br><button class="btn btn-info">Show a simple alert box</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'alert',
            body: '<p>This is an alert.</p>',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show an alert box with danger class</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'alert',
            bootstrapType : 'danger',
            body: '<p>This is an alert.</p>',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show an alert box with success class</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'alert',
            bootstrapType : 'success',
            body: '<p>This is an alert.</p>',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<br><br><button class="btn btn-info">Show a confirm box</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'confirm',
            title: 'Are you really sure of what you are doing ?',
            body: '<p>This is a confirmation box.</p>',
            callback:function(){
              setTimeout(function(){
                alert('You actually know what you are doing.')
              },500)
            },
            modalSize: 'modal-md',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show another confirm with danger class</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'confirm',
            className : 'alert-danger',
            title: 'Are you really sure of what you are doing ?',
            body: '<p>This is a confirmation box.</p>',
            callback:function(){
              setTimeout(function(){
                alert('You actually know what you are doing.')
              },500)
            },
            modalSize: 'modal-md',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show yet another confirm with custom buttons</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['CotApp']).showModal({
            preset:'confirm',
            title: 'Are you really sure of what you are doing ?',
            body: '<p>This is a confirmation box.</p>',
            callback:function(){
              setTimeout(function(){
                alert('You actually know what you are doing.')
              },500)
            },
            buttons: {
                confirm: {
                    label: 'Yes',
                    bootstrapType: 'success'
                },
                cancel: {
                    label: 'No',
                    bootstrapType: 'danger'
                }
            },
            modalSize: 'modal-md',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      );
  }


  renderExampleSection_tac(){
    let containerSelector = '#fepe_dashboard_tac > div';
    (window['CotApp'] || window['CotApp']).showTerms({
      termsText: '<p>You must agree to the following terms and conditions: blah blah...</p>',
      disagreedText: 'Why won\'t you agree?',
      agreedCookieName: 'example_tac_cookie',
      containerSelector,
      onAgreed: (termsWereShown) => {
        if (termsWereShown) {
          alert('Thanks for agreeing!');
        } else {
          this.$(containerSelector)
            .append('<p>You previously agreed to the terms and conditions.</p>');
        }
        this.$(containerSelector)
          .append('<p>Now there is a cookie on your browser that remembers that you agreed.</p>')
          .append($('<button class="btn btn-info">Reset the terms and conditions cookie</button>')
            .on('click', function () {
              $.cookie('example_tac_cookie', '');
              document.location.reload();
            })
          );
      },
      onDisagreed: function () {
        alert('You chose not to agree');
      },
      agreementTitle: 'Terms of Use Agreement'
    });
  }

  renderExampleSection_dropzone() {
    let containerSelector = '#fepe_dashboard_dropzone';
    const $container = $(containerSelector);

    $container.append('<h2>CoT Dropzone Class Example 1</h2>', '<div id="cotDropzoneClass1"></div>');

    var dz1 = new CotDropzone();
    dz1.render({
      url: 'https://was-intra-sit.toronto.ca/cc_sr_admin_v1/upload/jngo2/jngo2',

      acceptedFiles: 'image/*, application/x-msword, .xls, .xlsx',
      maxFiles: 5,
      maxFilesize: 10,

      selector: '#cotDropzoneClass1',

      fields: [{
        name: 'text01',
        title: 'Text Field',
        type: 'text',
        prehelptext: 'Help text',
        posthelptext: 'Help text'
      }, {
        name: 'textarea01',
        title: 'Textarea Field',
        type: 'textarea',
        prehelptext: 'Help text',
        posthelptext: 'Help text'
      }]
    });

    $container.append('<h2>CoT Dropzone Class Example 2</h2>', '<div id="cotDropzoneClass2"></div>');

    var dz2 = new CotDropzone({
      url: 'https://maserati.corp.toronto.ca:49097/c3api_upload/upload/apptest/ref',

      acceptedFiles: 'application/x-mspowerpoint, .pdf',
      maxFiles: 3,
      maxFilesize: 1,

      selector: '#cotDropzoneClass2',

      fields: [{
        name: 'text01',
        title: 'Text Field',
        type: 'text',
        prehelptext: 'Help text',
        posthelptext: 'Help text'
      }, {
        name: 'textarea01',
        title: 'Textarea Field',
        type: 'textarea',
        prehelptext: 'Help text',
        posthelptext: 'Help text'
      }]
    });

    $container.append('<div id="dzform"></div>');

    var dzformmodel = new Backbone.Model();
    var dzformdefinition = {
      title: 'CoT Form with Dropzone Field',

      sections: [{
        title: 'Section',

        rows: [{
          fields: [{
            title: 'Dropzone Field',
            type: 'dropzone',

            posthelptext: 'post help text',
            prehelptext: 'pre help text',

            options: {
              url: 'https://maserati.corp.toronto.ca:49097/c3api_upload/upload/apptest/ref',

              acceptedFiles: 'video/*, image/*',
              maxFiles: 10,
              maxFilesize: 5,

              selector: '#cotDropzoneClass2',

              fields: [{
                name: 'text01',
                title: 'Text Field',
                type: 'text',
                prehelptext: 'Help text',
                posthelptext: 'Help text'
              }, {
                name: 'textarea01',
                title: 'Textarea Field',
                type: 'textarea',
                prehelptext: 'Help text',
                posthelptext: 'Help text'
              }]
            },
          }]
        }]
      }]
    };
    var dzform = new CotForm(dzformdefinition);
    dzform.setModel(dzformmodel);
    dzform.render({ target: '#dzform' });
  }

  $(selector) {
    return this.$container.find(selector);
  }
}
