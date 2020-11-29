<?php

    include_once('class.database.php');

    class ManageUsers{

        protected $link;

        function __construct(){
            $db_conn = new ManageDatabase;
            $this->link = $db_conn->connect();
            return $this->link;
        }

        function addUsers($username,$firstname,$lastname,$email,$password,$ip_address,$user_level){
            $query = $this->link->prepare("INSERT INTO users (username,firstname,lastname,email,password,ip_address,user_level)
                VALUES (?,?,?,?,?,?,?) /*same amount of ? as parameters*/
            ");
            $values = array($username,$firstname,$lastname,$email,$password,$ip_address,$user_level);
            $query->execute($values);
            $rowCount = $query->rowCount();
            return $rowCount;
        }

        function listUsers($user_id = null){

            if(isset($user_id)){
                $query = $this->link->query("SELECT * FROM users WHERE id = '$user_id' LIMIT 1");

            }else{
                $query = $this->link->query("SELECT * FROM users ORDER BY id DESC");
            }
            
            $rowCount = $query->rowCount();
            if($rowCount >= 1){
                $result = $query->fetchAll();
            }else{
                $result = 0;
            }
            return $result;

        }

        function editUsers($user_id,$param){

            foreach($param as $key => $value){
                $query = $this->link->query("UPDATE users SET $key = '$value' WHERE id = '$user_id' LIMIT 1");
            }
            $rowCount = $query->rowCount();
            return $rowCount;
        }

        function deleteUsers($user_id){
            $query = $this->link->query("DELETE FROM users WHERE id = '$user_id' LIMIT 1");
            $rowCount = $query->rowCount();
            return $rowCount;
        }
    }
    
?>