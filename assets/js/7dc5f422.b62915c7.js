/*! For license information please see 7dc5f422.b62915c7.js.LICENSE.txt */
"use strict";(self.webpackChunkkevshin2002=self.webpackChunkkevshin2002||[]).push([[3024],{8566:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>b,contentTitle:()=>x,default:()=>w,frontMatter:()=>f,metadata:()=>s,toc:()=>y});const s=JSON.parse('{"id":"Robotics/ROS2/testing-ros2","title":"Testing","description":"Getting Started","source":"@site/docs/Robotics/ROS2/testing.mdx","sourceDirName":"Robotics/ROS2","slug":"/Robotics/ROS2/testing-ros2","permalink":"/docs/Robotics/ROS2/testing-ros2","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedAt":1735113600000,"sidebarPosition":3,"frontMatter":{"id":"testing-ros2","title":"Testing","hide_title":true,"sidebar_position":3,"last_update":{"date":"12/25/2024","author":"Kevin Shin"}},"sidebar":"noteSidebar","previous":{"title":"Perception","permalink":"/docs/Robotics/ROS2/perception"},"next":{"title":"URDF","permalink":"/docs/Robotics/ROS2/urdf"}}');var r=n(4848),o=n(8453);const a=(0,n(4722).A)("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);var l=n(1470),i=n(9365),c=n(2083),d=n(6540),h=n(2732),p=n(2552);const u=(0,h.F)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),_=d.forwardRef(((e,t)=>{let{className:n,variant:s,...o}=e;return(0,r.jsx)("div",{ref:t,role:"alert",className:(0,p.cn)(u({variant:s}),n),...o})}));_.displayName="Alert";const g=d.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,r.jsx)("h5",{ref:t,className:(0,p.cn)("mb-1 font-medium leading-none tracking-tight",n),...s})}));g.displayName="AlertTitle";const m=d.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,p.cn)("text-sm [&_p]:leading-relaxed",n),...s})}));m.displayName="AlertDescription";const f={id:"testing-ros2",title:"Testing",hide_title:!0,sidebar_position:3,last_update:{date:"12/25/2024",author:"Kevin Shin"}},x=void 0,b={},y=[{value:"<strong>Getting Started</strong>",id:"getting-started",level:2},{value:"<strong>Tests and Frameworks</strong>",id:"tests-and-frameworks",level:2},{value:"<strong>Unit Tests</strong>",id:"unit-tests",level:3},{value:"<strong>Integration Tests</strong>",id:"integration-tests",level:3},{value:"<strong>Library Unit Tests</strong>",id:"library-unit-tests",level:2},{value:"package.xml",id:"packagexml",level:4},{value:"setup.py",id:"setuppy",level:4},{value:"<strong>Test Suites</strong>",id:"test-suites",level:3},{value:"<strong>Node Tests</strong>",id:"node-tests",level:2},{value:"<strong>Automation</strong>",id:"automation",level:3},{value:"<strong>Integration Tests</strong>",id:"integration-tests-1",level:2}];function j(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"getting-started",children:(0,r.jsx)(t.strong,{children:"Getting Started"})}),"\n",(0,r.jsxs)(t.p,{children:["These notes are from ",(0,r.jsx)(t.a,{href:"https://app.theconstruct.ai",children:"The Construct"})," and was originally for ROS. Since they didn't have a couse on testing with ROS2, I referenced the ROS2 documentation and ChatGPT while doing this to fill in the gaps for ROS2 Testing. I used the docker image ",(0,r.jsx)(t.code,{children:"osrf/ros:humble-desktop"})," for my environment."]}),"\n",(0,r.jsx)(t.p,{children:"This note will go over:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Unit Testing"}),"\n",(0,r.jsx)(t.li,{children:"Node Level Tests"}),"\n",(0,r.jsx)(t.li,{children:"Integration Tests"}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"tests-and-frameworks",children:(0,r.jsx)(t.strong,{children:"Tests and Frameworks"})}),"\n",(0,r.jsxs)(c.XI,{children:[(0,r.jsx)(c.r6,{children:"Testing Frameworks and Their Purposes"}),(0,r.jsx)(c.A0,{children:(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nd,{children:"Testing Framework"}),(0,r.jsx)(c.nd,{children:"Language"}),(0,r.jsx)(c.nd,{children:"Purpose"})]})}),(0,r.jsxs)(c.BF,{children:[(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"Google Test"})}),(0,r.jsx)(c.nA,{children:"C++"}),(0,r.jsx)(c.nA,{children:"Unit testing with Google Test"})]}),(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"pytest"})}),(0,r.jsx)(c.nA,{children:"Python"}),(0,r.jsx)(c.nA,{children:(0,r.jsx)(t.p,{children:"Unit testing for Python-based ROS 2 nodes and library code"})})]}),(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"launch_testing"})}),(0,r.jsx)(c.nA,{children:"Python/C++"}),(0,r.jsx)(c.nA,{children:"Testing ROS 2 launch files"})]}),(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"mock, unittest"})}),(0,r.jsx)(c.nA,{children:"Python"}),(0,r.jsx)(c.nA,{children:"Unit testing with mock and unittest"})]}),(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"ros2-benchmarks"})}),(0,r.jsx)(c.nA,{children:"C++/Python"}),(0,r.jsx)(c.nA,{children:"Performance testing in ROS 2"})]}),(0,r.jsxs)(c.Hj,{children:[(0,r.jsx)(c.nA,{children:(0,r.jsx)("strong",{children:"Cucumber, Behave"})}),(0,r.jsx)(c.nA,{children:"Python"}),(0,r.jsx)(c.nA,{children:"Behavior-driven testing (BDD)"})]})]})]}),"\n",(0,r.jsxs)(t.p,{children:["I did not do any testing with gtest as of ",(0,r.jsx)(t.code,{children:"12/25/24"})," and this was done using ",(0,r.jsx)(t.code,{children:"unittest"}),"."]}),"\n",(0,r.jsx)(t.h3,{id:"unit-tests",children:(0,r.jsx)(t.strong,{children:"Unit Tests"})}),"\n",(0,r.jsx)(t.p,{children:"Unit tests are mainly to ensure correct functionality of a stand-alone unit or function. This means that they could test a single function, node, or process. Library unit tests are for testing non-ROS2 related issues while ROS2 unit tests are for ROS2 single nodes."}),"\n",(0,r.jsx)(t.h3,{id:"integration-tests",children:(0,r.jsx)(t.strong,{children:"Integration Tests"})}),"\n",(0,r.jsx)(t.p,{children:"Integration tests are to ensure correct functionality of the system as a whole. For ROS2, it means starting up multiple nodes and ensuring that they all work as intended."}),"\n",(0,r.jsx)(t.p,{children:"I will be using the code below for all testing purposes."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:"#!/usr/bin/env python3\n\nimport rclpy\nfrom rclpy.node import Node\nfrom geometry_msgs.msg import Twist\nfrom sensor_msgs.msg import LaserScan\nimport time\n\nclass RobotControl(Node):\n\n    def __init__(self):\n        super().__init__('robot_control_node')\n        self.vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)\n        self.cmd = Twist()\n        self.ctrl_c = False\n        self.rate = self.create_rate(10)\n        self.create_timer(0.1, self.shutdownhook)\n\n    def publish_once_in_cmd_vel(self):\n        \"\"\"\n        Publish a single Twist message to ensure command receipt.\n        \"\"\"\n        while not self.ctrl_c:\n            if self.vel_publisher.get_subscription_count() > 0:\n                self.vel_publisher.publish(self.cmd)\n                self.get_logger().info(\"Command published\")\n                break\n\t     else:\n                self.rate.sleep()\n\n    def shutdownhook(self):\n        self.stop_robot()\n        self.ctrl_c = True\n\n    def stop_robot(self):\n        self.cmd.linear.x = 0.0\n        self.cmd.angular.z = 0.0\n        self.publish_once_in_cmd_vel()\n\n    def get_inputs_rotate(self):\n        angular_speed = float(input('Enter angular speed (degrees/sec): '))\n        angle = float(input('Enter angle (degrees): '))\n        clockwise = input('Rotate clockwise? (y/n): ').strip().lower() == 'y'\n        return angular_speed, angle, clockwise\n\n    def convert_degree_to_rad(self, speed_deg, angle_deg):\n        angle = float(input('Enter angle (degrees): '))\n        clockwise = input('Rotate clockwise? (y/n): ').strip().lower() == 'y'\n        return angular_speed, angle, clockwise\n\n    def convert_degree_to_rad(self, speed_deg, angle_deg):\n        return speed_deg * 3.141592653589793 / 180, angle_deg * 3.141592653589793 / 180\n\n    def rotate(self):\n        angular_speed_d, angle_d, clockwise = self.get_inputs_rotate()\n        angular_speed_r, angle_r = self.convert_degree_to_rad(angular_speed_d, angle_d)\n\n        self.cmd.angular.z = -angular_speed_r if clockwise else angular_speed_r\n\n        start_time = self.get_clock().now()\n        current_angle = 0.0\n\n        while current_angle < angle_r:\n            self.vel_publisher.publish(self.cmd)\n            elapsed_time = self.get_clock().now() - start_time\n            current_angle = angular_speed_r * elapsed_time.nanoseconds * 1e-9\n            self.rate.sleep()\n\n        self.stop_robot()\n\ndef main(args=None):\n    rclpy.init(args=args)\n    robot_control = RobotControl()\n    try:\n        robot_control.rotate()\n    except KeyboardInterrupt:\n        robot_control.get_logger().info(\"Shutting down gracefully.\")\n    finally:\n        robot_control.destroy_node()\n        rclpy.shutdown()\n\nif __name__ == '__main__':\n    main()\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["All tests must be within ",(0,r.jsx)(t.code,{children:"test"})," directory and must start as ",(0,r.jsx)(t.code,{children:"test_*.py"})," conventionally."]})}),"\n",(0,r.jsx)(t.h2,{id:"library-unit-tests",children:(0,r.jsx)(t.strong,{children:"Library Unit Tests"})}),"\n",(0,r.jsxs)(t.p,{children:["Let's go ahead and create a simple unit test to see if our ",(0,r.jsx)(t.code,{children:"RobotControl"})," is behaving as correctly."]}),"\n",(0,r.jsxs)(l.A,{children:[(0,r.jsx)(i.A,{label:"test_robot_control.py",value:"test_robot_control",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:'#!/usr/bin/env python3\n\nimport unittest # Testing framework\nimport rclpy\nfrom robot_control_py.robot_control import RobotControl\n\nclass TestRobotControl(unittest.TestCase):\n\n    @classmethod\n    def setUpClass(cls): # Part of the unittest framework where we override to specify logic when we instantiate the Test Node.\n        """Initialize rclpy once for the entire test class."""\n        rclpy.init()\n\n    @classmethod\n    def tearDownClass(cls): # Part of the unittest framework where we override to specify logic for shutting down\n        """Shutdown rclpy once after all tests are complete."""\n        rclpy.shutdown()\n\n    def setUp(self): # Applies to each individual test cases and is ran before each test.\n        """Set up the test environment by creating a RobotControl node."""\n        self.rc = RobotControl()\n\n    def tearDown(self): # Applies to each after individual test case.\n        """Clean up resources after each test."""\n        self.rc.destroy_node()\n\n    def test_deg_rad_conversion(self):\n        """Test degree-to-radian conversion."""\n        speed, angle = self.rc.convert_degree_to_rad(60, 90)\n        self.assertAlmostEqual(speed, 1.0472, places=4, msg="Speed conversion failed")\n        self.assertAlmostEqual(angle, 1.57, places=2, msg="Angle conversion failed")\n\nif **name** == \'**main**\':\nunittest.main()\n\n'})})}),(0,r.jsxs)(i.A,{label:"CMakeLists",value:"CMakeLists",children:[(0,r.jsxs)(t.p,{children:["ROS2 has a built-in testing system using it's build system ",(0,r.jsx)(t.code,{children:"colcon"}),", however, to set it up, we have to configure some files. As a general rule of thumb, while ROS2 ",(0,r.jsx)(t.code,{children:"ament_python"})," is available as a build type, it's in your best interest to work with ",(0,r.jsx)(t.code,{children:"ament_cmake"})," as most ROS2 features require a ",(0,r.jsx)(t.code,{children:"CMakeLists.txt"}),"."]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-txt",children:"if(BUILD_TESTING)\n    find_package(ament_cmake_pytest REQUIRED)\n    ament_add_pytest_test(test_robot_control test/test_robot_control.py)\nendif()\n"})})]}),(0,r.jsxs)(i.A,{label:"package.xml/setup.py",value:"package.xml/setup.py",children:[(0,r.jsx)(t.h4,{id:"packagexml",children:"package.xml"}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-txt",children:"<test_depend>ament_cmake_pytest</test_depend>\n"})}),(0,r.jsx)(t.h4,{id:"setuppy",children:"setup.py"}),(0,r.jsxs)(t.p,{children:["This is only if you are using an ",(0,r.jsx)(t.code,{children:"ament_python"})," package, and is to provide the ROS2 environment where the test files are after building. Note that you will need the two above files as well."]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:"(os.path.join('share', package_name, 'test'), glob('test/*.py'))\n"})})]})]}),"\n",(0,r.jsxs)(t.admonition,{type:"info",children:[(0,r.jsxs)(t.p,{children:["If you don't want to utilize the ",(0,r.jsx)(t.code,{children:"colcon"})," build system, you can run the python file as a stand-alone script."]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"python3 test_robot_control.py # Run without ROS2 environment\ncolcon test --packages-select <package_name> # Run with ROS2 environment\ncolcon test-result --all --verbose # Run to see results\n"})})]}),"\n",(0,r.jsx)(t.p,{children:"The outputs for success and failing:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-text",children:'.\n----------------------------------------------------------------------\nRan 1 test in 0.024s\n\nOK\n\n######################################################################\n\nF\n======================================================================\nFAIL: test_deg_rad_conversion (__main__.TestRobotControl)\nTest degree-to-radian conversion.\n----------------------------------------------------------------------\nTraceback (most recent call last):\n  File "/ros2_ws/src/robot_control_py/test/test_robot_control.py", line 30, in test_deg_rad_conversion\n    self.assertAlmostEqual(speed, 1.0472, places=4, msg="Speed conversion failed")\nAssertionError: 0.5235987755982988 != 1.0472 within 4 places (0.5236012244017011 difference) : Speed conversion failed\nFinished <<< robot_control_py [0.63s]\nSummary: 1 package finished [0.83s]\nroot@9f3977f822c1:/ros2_ws# colcon test-result --verbose\nSummary: 1 test, 0 errors, 0 failures, 0 skipped\n'})}),"\n",(0,r.jsx)(t.h3,{id:"test-suites",children:(0,r.jsx)(t.strong,{children:"Test Suites"})}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"unittest"})," provides what's known as a Test Suite which allows us to modularize our test cases for different functionalities. Test Suites contain test cases or even other test suites."]}),"\n",(0,r.jsx)(t.p,{children:"We can create a TestSuite via below:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:'#!/usr/bin/env python3\n\nimport unittest\nimport rclpy\nfrom robot_control_py.robot_control import RobotControl\n\nclass TestCaseA(unittest.TestCase):\n\n    @classmethod\n    def setUpClass(cls):\n        rclpy.init()\n\n    @classmethod\n    def tearDownClass(cls):\n        rclpy.shutdown()\n\n    def setUp(self):\n        self.rc = RobotControl()\n\n    def test_case_a(self):\n        speed, angle = self.rc.convert_degree_to_rad(60, 90)\n        self.assertAlmostEqual(angle, 1.57, places=2, msg="Test Case A failed")\n\nclass TestCaseB(unittest.TestCase):\n    @classmethod\n    def setUpClass(cls):\n        rclpy.init()\n\n    @classmethod\n    def tearDownClass(cls):\n        rclpy.shutdown()\n\n    def setUp(self):\n        self.rc = RobotControl()\n\n    def test_case_b(self):\n        speed, angle = self.rc.convert_degree_to_rad(60, -90)\n        self.assertAlmostEqual(angle, 1.57, places=2, msg="Test Case B failed")\n'})}),"\n",(0,r.jsxs)(t.p,{children:["If we don't want to use the ",(0,r.jsx)(t.code,{children:"colcon"})," build system, we need a runner for this."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:"import unittest\nfrom test_robot_control_cases import TestCaseA, TestCaseB\n\nif __name__ == '__main__':\n    suite = unittest.TestSuite()\n    suite.addTest(TestCaseA('test_case_a'))\n    suite.addTest(TestCaseB('test_case_b'))\n    runner = unittest.TextTestRunner()\n    runner.run(suite)\n"})}),"\n",(0,r.jsx)(t.p,{children:"Output:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'root@9f3977f822c1:/ros2_ws/src/robot_control_py/test# python3 run_tests.py\n.F\n======================================================================\nFAIL: test_case_b (test_robot_control_cases.TestCaseB)\n----------------------------------------------------------------------\nTraceback (most recent call last):\n  File "/ros2_ws/src/robot_control_py/test/test_robot_control_cases.py", line 39, in test_case_b\n    self.assertAlmostEqual(angle, 1.57, places=2, msg="Test Case B failed")\nAssertionError: -1.5707963267948966 != 1.57 within 2 places (3.140796326794897 difference) : Test Case B failed                                                                                             ----------------------------------------------------------------------\nRan 2 tests in 0.054s\nFAILED (failures=1)\n'})}),"\n",(0,r.jsx)(t.p,{children:"The tests are failing because we only want positive angles but are accounting for negative angles. We can fix it by adjusting our core code and rebuilding, and doing so will pass our tests."}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["If you only want to see tests for one package, run\n",(0,r.jsx)(t.code,{children:"colcon test-result --test-result-base build/<package_name> "})]})}),"\n",(0,r.jsx)(t.p,{children:"If you want to color code it, run this command or put it inside a script file:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'#!/bin/bash\ncolcon test --packages-select <package_name> --pytest-args="--color=yes" --pytest-args="-v" --event-handlers console_direct+\n\nroot@9f3977f822c1:/ros2_ws# ./tests.sh\nStarting >>> robot_control_py\n============================= test session starts ==============================\nplatform linux -- Python 3.10.12, pytest-6.2.5, py-1.10.0, pluggy-0.13.0 -- /usr/bin/python3\ncachedir: /ros2_ws/build/robot_control_py/.pytest_cache\nrootdir: /ros2_ws/src/robot_control_py, configfile: pytest.ini\nplugins: ament-flake8-0.12.11, ament-pep257-0.12.11, ament-xmllint-0.12.11, ament-copyright-0.12.11, ament-lint-0.12.11, launch-testing-ros-0.19.8, launch-testing-1.0.7, colcon-core-0.18.4\ncollecting ...\ncollected 3 items\ntest/test_robot_control_cases.py::TestCaseA::test_case_a PASSED          [ 33%]\ntest/test_robot_control_cases.py::TestCaseB::test_case_b PASSED          [ 66%]\ntest/test_robot_control_cases.py::TestCaseB::test_case_string PASSED     [100%]\n-------- generated xml file: /ros2_ws/build/robot_control_py/pytest.xml --------\n============================== 3 passed in 0.12s ===============================\nFinished <<< robot_control_py [0.63s]                                                                                                                                                                       Summary: 1 package finished [0.83s]\n'})}),"\n",(0,r.jsx)(t.h2,{id:"node-tests",children:(0,r.jsx)(t.strong,{children:"Node Tests"})}),"\n",(0,r.jsx)(t.p,{children:"Let's do some Node Testing, which is just unit test for ROS2 nodes."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-py",children:"#!/usr/bin/env python3\n\nfrom robot_control_py.robot_control import RobotControl\nfrom rclpy.node import Node\nfrom geometry_msgs.msg import Twist\nimport time\nimport rclpy\nimport unittest\n\n\nclass TestRobotControl(unittest.TestCase):\n    @classmethod\n    def setUpClass(cls):\n        rclpy.init()\n\n    @classmethod\n    def tearDownClass(cls):\n        rclpy.shutdown()\n\n    def setUp(self):\n        self.node = rclpy.create_node('test_robot_control_node')\n        self.rc = RobotControl()\n        self.success = False\n\n    def callback(self, msg):\n        print(f\"Received Angular Speed: {msg.angular.z}\")\n        self.success = msg.angular.z == 1.0\n\n    def test_publish_cmd_vel(self):\n        test_sub = self.node.create_subscription(\n            Twist, \"/cmd_vel\", self.callback, 10\n        )\n        self.rc.cmd.angular.z = 1.0\n        self.rc.publish_once_in_cmd_vel()\n        timeout_t = time.time() + 10.0  # 10 seconds\n\n        rclpy.spin_once(self.node, timeout_sec=0.1)\n        while not self.success and time.time() < timeout_t:\n            rclpy.spin_once(self.node, timeout_sec=0.1)\n\n        self.assertTrue(self.success)\n\n    def tearDown(self):\n        self.node.destroy_node()\n\n\nif __name__ == '__main__':\n    unittest.main()\n"})}),"\n",(0,r.jsx)(t.p,{children:"The only difference is that before each test, we are instantiating a ROS2 node and using it within our test function. In our case, we're subscribing to /cmd_vel, and seeing if we do get a message back."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"python3 test_robot_control_node.py\n[INFO] [1735008562.793690945] [robot_control_node]: Command published\nReceived Angular Speed: 1.0\n.\n----------------------------------------------------------------------\nRan 1 test in 0.036s\n\nOK\n\n======================================================================\n./tests.sh robot_control_py\n./tests.sh robot_control_py\nStarting >>> robot_control_py\n============================= test session starts ==============================\nplatform linux -- Python 3.10.12, pytest-6.2.5, py-1.10.0, pluggy-0.13.0 -- /usr/bin/python3\ncachedir: /ros2_ws/build/robot_control_py/.pytest_cache\nrootdir: /ros2_ws/src/robot_control_py, configfile: pytest.ini\nplugins: ament-flake8-0.12.11, ament-pep257-0.12.11, ament-xmllint-0.12.11, ament-copyright-0.12.11, ament-lint-0.12.11, launch-testing-ros-0.19.8, launch-testing-1.0.7, colcon-core-0.18.4\ncollecting ...\ncollected 4 items\n\ntest/test_robot_control_cases.py::TestCaseA::test_case_a PASSED          [ 25%]\ntest/test_robot_control_cases.py::TestCaseB::test_case_b PASSED          [ 50%]\ntest/test_robot_control_cases.py::TestCaseB::test_case_string PASSED     [ 75%]\ntest/test_robot_control_node.py::TestRobotControl::test_publish_cmd_vel PASSED [100%]\n\n-------- generated xml file: /ros2_ws/build/robot_control_py/pytest.xml --------\n============================== 4 passed in 0.15s ===============================\nFinished <<< robot_control_py [0.67s]\n\nSummary: 1 package finished [0.89s]\n"})}),"\n",(0,r.jsx)(t.h3,{id:"automation",children:(0,r.jsx)(t.strong,{children:"Automation"})}),"\n",(0,r.jsx)(t.p,{children:"There's actually a way simpler way where we just modify the CMakeLists and package.xml, and remove all the unnecessary stuff from main. From the ROS2 documentation,"}),"\n",(0,r.jsxs)(l.A,{children:[(0,r.jsx)(i.A,{label:"CMakeLists",value:"CMakeLists",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-txt",children:'cmake_minimum_required(VERSION 3.8)\nproject(app)\n\nif(BUILD_TESTING)\n\n# Integration tests\n\nfind_package(ament_cmake_ros REQUIRED)\nfind_package(launch_testing_ament_cmake REQUIRED)\nfunction(add_ros_isolated_launch_test path)\nset(RUNNER "${ament_cmake_ros_DIR}/run_test_isolated.py")\n    add_launch_test("${path}" RUNNER "${RUNNER}" ${ARGN})\nendfunction()\nadd_ros_isolated_launch_test(test/<any_test>.py)\nendif()\n\n'})})}),(0,r.jsx)(i.A,{label:"package.xml",value:"package.xml",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-xml",children:"<test_depend>ament_cmake_ros</test_depend>\n<test_depend>launch</test_depend>\n<test_depend>launch_ros</test_depend>\n<test_depend>launch_testing</test_depend>\n<test_depend>launch_testing_ament_cmake</test_depend>\n<test_depend>rclpy</test_depend>\n"})})})]}),"\n",(0,r.jsxs)(t.p,{children:["And you can just run ",(0,r.jsx)(t.code,{children:"colcon test"})," to get your tests. I came upon this after attempting to figure out how to create launch files for testing."]}),"\n",(0,r.jsx)(t.h2,{id:"integration-tests-1",children:(0,r.jsx)(t.strong,{children:"Integration Tests"})}),"\n",(0,r.jsxs)(t.p,{children:["We can use the same CMake file for configuring an integration test as it was built for that purpose. The ",(0,r.jsx)(t.code,{children:"add_ros_isolated_launch_test"})," isolates the nodes in order to test them. In fact, as long as our CMake file contains those lines of code, we don't have to worry about tests as long as all of our tests are in the test directory and starts with ",(0,r.jsx)(t.code,{children:"test_*.py"})]}),"\n",(0,r.jsxs)(_,{children:[(0,r.jsx)(a,{className:"h-4 w-4"}),(0,r.jsx)(g,{children:"Just gonna put this here..."}),(0,r.jsx)(m,{children:(0,r.jsx)(t.p,{children:"To be frank, there wasn't much in this note. Maybe when I have time, I'll\nuse gtest with ROS2 for a more robust framework."})})]})]})}function w(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(j,{...e})}):j(e)}},2083:(e,t,n)=>{n.d(t,{A0:()=>l,BF:()=>i,Hj:()=>c,XI:()=>a,nA:()=>h,nd:()=>d,r6:()=>p});var s=n(6540),r=n(2552),o=n(4848);const a=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("div",{className:"relative w-full overflow-auto",children:(0,o.jsx)("table",{ref:t,className:(0,r.cn)("w-full caption-bottom text-sm",n),...s})})}));a.displayName="Table";const l=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("thead",{ref:t,className:(0,r.cn)("[&_tr]:border-b",n),...s})}));l.displayName="TableHeader";const i=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("tbody",{ref:t,className:(0,r.cn)("[&_tr:last-child]:border-0",n),...s})}));i.displayName="TableBody";s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("tfoot",{ref:t,className:(0,r.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",n),...s})})).displayName="TableFooter";const c=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("tr",{ref:t,className:(0,r.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",n),...s})}));c.displayName="TableRow";const d=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("th",{ref:t,className:(0,r.cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",n),...s})}));d.displayName="TableHead";const h=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("td",{ref:t,className:(0,r.cn)("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",n),...s})}));h.displayName="TableCell";const p=s.forwardRef(((e,t)=>{let{className:n,...s}=e;return(0,o.jsx)("caption",{ref:t,className:(0,r.cn)("mt-4 text-sm text-muted-foreground",n),...s})}));p.displayName="TableCaption"},2552:(e,t,n)=>{n.d(t,{cn:()=>o});var s=n(4164),r=n(856);function o(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,r.QP)((0,s.$)(t))}}}]);