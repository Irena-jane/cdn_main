(function(){
  var app = angular.module('cost', ['ui-rangeSlider']);

  var currency,
  info_tb = [],
  info_gb = [],
  info_rub_tb = [],
  info_rub_gb = [],
  info_euro_tb = [],
  info_euro_gb = [],
  $widget = angular.element(document.querySelector('.widget-cost')),
  nums = $widget.find('.widget-cost__num'),
  rubs = $widget.find('.wc-rub'),
  prices = $widget.find('.widget-cost__price'),
  outputs = $widget.find('.widget-cost__output');
 $.ajax({
       type: "GET",
       async : false,
       url: "../cb.xml",
       dataType: "xml",
       success: XmlKurs
  });

var cost = this;

      // $http.get('/cost.json').success(function(data){
      //   info_rub_tb = data;
      //   console.log(info_rub_tb);

      // });
      getData();
      if(!localStorage.getItem('info_tb')) saveData();


  app.controller('CostController',['$http', function($http){

  }] );
  app.controller('SliderCtrlController', function($rootScope){
    var control = this,
    rangeElem = $widget.find('.ngrs-value-min input'),
    outputs = $widget.find('.widget-cost__output'),
    units = $widget.find('.widget-cost__units');
    this.key = 'rus';
    this.max = 5;
    this.tb = true;
    this.rub = true;
    this.rangeValue = 0;

      $rootScope.$on('rangeSlider.update', function(e){
        this.rangeValue = e.targetScope.filteredModelMin;

        onRangeUpdate(outputs, 'widget-cost__output--active', this.rangeValue);
        onRangeUpdate(rubs, 'wc-rub--active', this.rangeValue);

      });

      function onRangeUpdate(arr, activeClass, rangeValue){
        for(var i = 0, len = arr.length; i < len; i++){
          var item = angular.element(arr[i]);
          if(item.parent().hasClass('ng-hide')) continue;
          if(item.data('index') === this.rangeValue){
            item.addClass(activeClass);
          }else{
            item.removeClass(activeClass);
          }
        }

      }

    this.getSettings = function(key){
      return this.key === key;
    };


    this.setSettings = function(key){
      this.key = key;
      switch(key){
        case 'rus':
        this.max = 5;
        break;
        case 'eur':
        case 'amer':
        this.max = 4;
        break;
      }

      // var val = rangeElem.attr('value');
      //  if(val > this.max-1) {
      //   val = this.max-1;
      //   rangeElem.attr('value', val);

      // }
      // $widget.find('.widget-cost__output--active').removeClass('widget-cost__output--active');
      // outputs.each(function(i, elem){
      //   var el = angular.element(elem);

      //   if(!el.parent().hasClass('ng-hide') && el.data('index') == val){
      //     el.addClass('widget-cost__output--active');
      //   }

      // });

      adjustPrice(this.rub, this.tb);

    };
    this.setSettingsTB = function(key){
      this.tb = (key === 'tb')? true: false;

        for(var i = 0, len = nums.length;i < len;i++){
          var num = angular.element(nums[i]);
          if(this.tb){
          num.html(info_tb[i]);
          }else{
            num.html(info_gb[i]);
          }
        }
        adjustPrice(this.rub, this.tb);
    };


    this.getSliderArea = function(max){
      return this.max === max;
    };

    this.setSliderUnit = function(val){
      this.rub = (val === 'rub')? true: false;

      adjustPrice(this.rub, this.tb);
    };


  });

  app.controller('DataStorageController', function(){
    var storage = this,
    rangeElem = $widget.find('.ngrs-value-min input'),
    outputs = $widget.find('.widget-cost__output'),
    units = $widget.find('.widget-cost__units');
    this.rub = true;

    this.setSliderUnit = function(val){
      this.rub = (val === 'rub')? true: false;

      // adjustPrice(this.rub, this.tb);
    };


  });

  function adjustPrice(rub, tb){
      var arr;
      var unitName;

      if(rub && tb){
         arr = info_rub_tb;
         unitName = '<del>P</del>/ТБ';
      }
      if(rub && !tb){
        arr = info_rub_gb;
        unitName = '<del>P</del>/ГБ';
      }

      if(!rub && tb){
        arr = info_euro_tb;
        unitName = '€/ТБ';
      }

      if(!rub && !tb){
        arr = info_euro_gb;
        unitName = '€/ГБ';
      }


    for(var i = 0, len = prices.length;i < len;i++){
      var price = angular.element(prices[i]);
      price.html(arr[i]);
    }
    for(var j = 0, leng = units.length;j < leng;j++){
      var unit = angular.element(units[j]);
      unit.html(unitName);
    }
  }

  function XmlKurs (xml) {
    if($(xml)){
      $(xml).find("Valute").each(function(){
            if($(this).attr('ID')=='R01239') {

                currency = $(this).find("Value").text();
             }
         });
    }else{

      currency = 55.1085;
        }
console.log(currency);

    }

  function getData(){
      if(!localStorage) return;
      if (localStorage && !localStorage.getItem("info_tb")) {
          for(var i=0, len = nums.length; i<len;i++){
              info_tb.push($(nums[i]).text());
              info_gb.push(parseInt($(nums[i]).text())*1024 + " GB");
          }
          for(var j=0, leng = rubs.length-1; j<leng;j++){ //leng -1 - не включаем последний пункт Песональная цена

              var v = parseInt($(prices[j]).text());

              // var v2 = $(prices[j]).text();
              info_rub_tb.push(v);
              info_rub_gb.push((v/1024).toFixed());

              v3 = ((v/parseInt(currency)).toFixed());
              info_euro_tb.push(v3);
              info_euro_gb.push(((v/parseInt(currency))/1024).toFixed(2));
          }

      }else{
          info_tb = JSON.parse(localStorage.getItem("info_tb"));
          info_gb = JSON.parse(localStorage.getItem("info_gb"));
          info_rub_tb = JSON.parse(localStorage.getItem("info_rub_tb"));
          info_rub_gb = JSON.parse(localStorage.getItem("info_rub_gb"));
          info_euro_tb = JSON.parse(localStorage.getItem("info_euro_tb"));
          info_euro_gb = JSON.parse(localStorage.getItem("info_euro_gb"));

      }
  };

  function saveData(){
    if(localStorage) {
       localStorage.setItem("info_tb", JSON.stringify(info_tb));
        localStorage.setItem("info_gb", JSON.stringify(info_gb));
        localStorage.setItem("info_rub_tb", JSON.stringify(info_rub_tb));
        localStorage.setItem("info_rub_gb", JSON.stringify(info_rub_gb));
        localStorage.setItem("info_euro_tb", JSON.stringify(info_euro_tb));
        localStorage.setItem("info_euro_gb", JSON.stringify(info_euro_gb));
    }
  };

})();
