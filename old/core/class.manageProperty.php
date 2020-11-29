<?php

    class ManageProperty{

        protected $link;

        function __construct(){
            $db_conn = new ManageDatabase;
            $this->link = $db_conn->connect();
            return $this->link;
        }

        function addProperty($username,$address, $postcode, $marketValue,$rent,$expenses,$comments, $ip_address, $date, $time)
            $query = $this->link->prepare("INSEDRT INTO property (username,address,postcode,marketValue,rent,expenses,comments,ip_address,date,time)
                VALUES (?,?,?,?,?,?,?,?,?,?)
        ");
        $values = array($username,$address, $postcode, $marketValue,$rent,$expenses,$comments, $ip_address, $date, $time);
        $query->execute($values);
        $rowCount = $query->rowCount();
        return $rowCount;
    }
    
    function listProperty($param = null){

        if(isset($property_id)){
            foreach($param as $key => $value){
                $query = $this->link->query("SELECT * FROM property WHERE $key = '$value' ORDER BY id DESC");
            }
        }else{
                $query = $this->link->query("SELECT * FROM property ORDER BY id DESC");
            }
            $rowCount = $query->rowCount();
            if($rowCount >= 1){
                $result = $query->fetchAll();
            }else{
                $result = 0;
            }
            return $result;

        }

        function editProperty($property_id, $param){
            foreach($param as $key => $value){
                $query = $this->link->query("UPDATE property SET $key = '$value' WHERE id = '$property_id' LIMIT 1");
            }
            $rowCount = $query->rowCount();
            return $rowCount;

        }
        function deleteSurvey($property_id){  
            $query = $this->link->query("DELETE FROM property WHERE id = '$property_id' LIMIT 1");
            $rowCount = $query->rowCount();
            return $rowCount;
            
        }

    }
?>