Feature: I Want To Book A Car

  Scenario Outline: I Want To Book A Pay Later Budget Car in US Market 

    Given User navigates to the application in "<market>" market
    And User Logs in to Horizon application using "<accountType>" account
   

    Examples:
      | market  | accountType       |
      | US-HOME | Consumer Platinum |
 
